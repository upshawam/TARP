from __future__ import annotations

import csv
import json
import os
import shutil
import subprocess
import sys
import time
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib import error, request


BASELINE_CSV = Path("public/data/tarp.csv")
MASTER_CSV = Path("data-monitor/master/tarp_master.csv")
SNAPSHOT_DIR = Path("data-monitor/snapshots")
METADATA_JSON = Path("data-monitor/metadata.json")
CHANGE_HISTORY_JSON = Path("data-monitor/change-history.json")
LATEST_DIFF_MD = Path("data-monitor/latest-diff.md")
RUN_RESULT_JSON = Path("data-monitor/run-result.json")
STATUS_PAGE_HTML = Path("public/data-monitor/status.html")

SOURCE_URL = os.getenv(
    "TARP_SOURCE_URL",
    "https://www.tn.gov/twra/fishing/tennessee-angler-recognition-program/_jcr_content/contentFullWidth/tn_complex_datatable.exceldriven.json",
)

EXPECTED_COLUMNS = [
    "Angler's Name",
    "Kind of Fish (Species)",
    "Length of fish",
    "Body of Water Caught",
    "County",
    "Date Caught",
]

ID_COLUMNS = [
    "Angler's Name",
    "Kind of Fish (Species)",
    "Body of Water Caught",
    "County",
    "Date Caught",
]


@dataclass
class MonitorResult:
    changed: bool
    checked_at: str
    changed_at: str | None
    source_url: str
    previous_count: int
    current_count: int
    added_rows: list[dict[str, str]]
    removed_rows: list[dict[str, str]]
    changed_rows: list[dict[str, Any]]
    snapshot_path: str | None
    error: str | None = None


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_dirs() -> None:
    for path in [
        MASTER_CSV.parent,
        SNAPSHOT_DIR,
        METADATA_JSON.parent,
        CHANGE_HISTORY_JSON.parent,
        LATEST_DIFF_MD.parent,
        RUN_RESULT_JSON.parent,
        STATUS_PAGE_HTML.parent,
    ]:
        path.mkdir(parents=True, exist_ok=True)


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows: list[dict[str, str]] = []
        for row in reader:
            normalized = {col: normalize_value(row.get(col)) for col in EXPECTED_COLUMNS}
            rows.append(normalized)
        return rows


def write_csv_rows(path: Path, rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=EXPECTED_COLUMNS, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(rows)


def normalize_whitespace(value: str) -> str:
    return " ".join(value.split())


def normalize_date(value: str) -> str:
    text = value.strip()
    if not text:
        return ""

    for fmt in ("%m/%d/%Y", "%m/%d/%y", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            dt = datetime.strptime(text, fmt)
            return dt.strftime("%m/%d/%Y")
        except ValueError:
            continue
    return text


def normalize_value(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).replace("\u00a0", " ").strip()
    text = normalize_whitespace(text)
    return text


def normalize_row(raw: dict[str, Any]) -> dict[str, str]:
    row = {col: normalize_value(raw.get(col, "")) for col in EXPECTED_COLUMNS}
    row["Date Caught"] = normalize_date(row["Date Caught"])
    return row


def fetch_json_with_retry(url: str, attempts: int = 5, timeout_sec: int = 45) -> Any:
    delay = 2
    last_error: Exception | None = None

    for attempt in range(1, attempts + 1):
        try:
            req = request.Request(url, headers={"User-Agent": "tarp-monitor/1.0"})
            with request.urlopen(req, timeout=timeout_sec) as response:
                payload = response.read().decode("utf-8")
                return json.loads(payload)
        except error.HTTPError as exc:
            last_error = exc
            if exc.code not in {429, 500, 502, 503, 504}:
                raise
        except (error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc

        # Fallback to curl can help with environment-specific TLS failures.
        try:
            result = subprocess.run(
                ["curl", "-fsSL", url],
                capture_output=True,
                text=True,
                check=True,
            )
            return json.loads(result.stdout)
        except Exception as exc:  # noqa: BLE001
            last_error = exc

        if attempt < attempts:
            time.sleep(delay)
            delay = min(delay * 2, 30)

    raise RuntimeError(f"Unable to fetch JSON after {attempts} attempts: {last_error}")


def find_best_row_list(payload: Any) -> list[dict[str, Any]]:
    candidates: list[list[dict[str, Any]]] = []

    def visit(node: Any, depth: int = 0) -> None:
        if depth > 6:
            return
        if isinstance(node, list) and node and all(isinstance(item, dict) for item in node):
            candidates.append(node)
        elif isinstance(node, dict):
            for value in node.values():
                visit(value, depth + 1)

    visit(payload)

    if isinstance(payload, list) and all(isinstance(item, dict) for item in payload):
        candidates.append(payload)

    if not candidates:
        raise RuntimeError("No list of row objects found in source payload.")

    def score(candidate: list[dict[str, Any]]) -> tuple[int, int]:
        first_keys = set(candidate[0].keys()) if candidate else set()
        matched = len(first_keys.intersection(EXPECTED_COLUMNS))
        return (matched, len(candidate))

    best = max(candidates, key=score)
    if score(best)[0] == 0:
        raise RuntimeError("Payload rows do not include expected columns.")

    return best


def row_key(row: dict[str, str]) -> tuple[str, ...]:
    return tuple(row[col] for col in EXPECTED_COLUMNS)


def id_key(row: dict[str, str]) -> tuple[str, ...]:
    return tuple(row[col] for col in ID_COLUMNS)


def multiset_rows(rows: list[dict[str, str]]) -> Counter[tuple[str, ...]]:
    return Counter(row_key(row) for row in rows)


def tuple_to_row(values: tuple[str, ...]) -> dict[str, str]:
    return {col: values[idx] for idx, col in enumerate(EXPECTED_COLUMNS)}


def diff_rows(old_rows: list[dict[str, str]], new_rows: list[dict[str, str]]) -> tuple[list[dict[str, str]], list[dict[str, str]], list[dict[str, Any]]]:
    old_counts = multiset_rows(old_rows)
    new_counts = multiset_rows(new_rows)

    added_full: list[dict[str, str]] = []
    removed_full: list[dict[str, str]] = []

    for row_tuple, count in (new_counts - old_counts).items():
        added_full.extend([tuple_to_row(row_tuple)] * count)

    for row_tuple, count in (old_counts - new_counts).items():
        removed_full.extend([tuple_to_row(row_tuple)] * count)

    added_by_id: dict[tuple[str, ...], list[dict[str, str]]] = defaultdict(list)
    removed_by_id: dict[tuple[str, ...], list[dict[str, str]]] = defaultdict(list)

    for row in added_full:
        added_by_id[id_key(row)].append(row)
    for row in removed_full:
        removed_by_id[id_key(row)].append(row)

    changed_rows: list[dict[str, Any]] = []

    for key in set(added_by_id.keys()).intersection(removed_by_id.keys()):
        add_items = added_by_id[key]
        rem_items = removed_by_id[key]
        pair_count = min(len(add_items), len(rem_items))

        for _ in range(pair_count):
            after = add_items.pop()
            before = rem_items.pop()
            field_changes = {
                col: {"before": before[col], "after": after[col]}
                for col in EXPECTED_COLUMNS
                if before[col] != after[col]
            }
            if field_changes:
                changed_rows.append(
                    {
                        "identity": {ID_COLUMNS[idx]: key[idx] for idx in range(len(ID_COLUMNS))},
                        "before": before,
                        "after": after,
                        "field_changes": field_changes,
                    }
                )

    added_rows: list[dict[str, str]] = []
    removed_rows: list[dict[str, str]] = []

    for rows in added_by_id.values():
        added_rows.extend(rows)
    for rows in removed_by_id.values():
        removed_rows.extend(rows)

    return added_rows, removed_rows, changed_rows


def load_metadata() -> dict[str, Any]:
    if METADATA_JSON.exists():
        return json.loads(METADATA_JSON.read_text(encoding="utf-8"))
    return {
        "source_url": SOURCE_URL,
        "last_checked": None,
        "last_changed": None,
        "current_record_count": 0,
        "master_csv": str(MASTER_CSV).replace("\\", "/"),
    }


def load_history() -> list[dict[str, Any]]:
    if CHANGE_HISTORY_JSON.exists():
        return json.loads(CHANGE_HISTORY_JSON.read_text(encoding="utf-8"))
    return []


def write_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def markdown_row(row: dict[str, str]) -> str:
    return " | ".join(row[col] or "-" for col in EXPECTED_COLUMNS)


def build_diff_markdown(result: MonitorResult) -> str:
    lines: list[str] = []
    lines.append("# Latest TARP Data Diff")
    lines.append("")
    lines.append(f"- Checked at (UTC): {result.checked_at}")
    lines.append(f"- Source URL: {result.source_url}")
    lines.append(f"- Previous count: {result.previous_count}")
    lines.append(f"- Current count: {result.current_count}")
    lines.append(f"- Added rows: {len(result.added_rows)}")
    lines.append(f"- Removed rows: {len(result.removed_rows)}")
    lines.append(f"- Changed rows: {len(result.changed_rows)}")
    lines.append("")

    lines.append("## Columns")
    lines.append("")
    lines.append(" | ".join(EXPECTED_COLUMNS))
    lines.append(" | ".join(["---"] * len(EXPECTED_COLUMNS)))

    if result.added_rows:
        lines.append("")
        lines.append("## Added Rows")
        lines.append("")
        for row in result.added_rows:
            lines.append(markdown_row(row))

    if result.removed_rows:
        lines.append("")
        lines.append("## Removed Rows")
        lines.append("")
        for row in result.removed_rows:
            lines.append(markdown_row(row))

    if result.changed_rows:
        lines.append("")
        lines.append("## Changed Rows")
        lines.append("")
        for idx, row_change in enumerate(result.changed_rows, start=1):
            lines.append(f"### Change {idx}")
            lines.append("")
            lines.append(f"- Identity: `{json.dumps(row_change['identity'], ensure_ascii=False)}`")
            lines.append("- Field changes:")
            for field, values in row_change["field_changes"].items():
                lines.append(f"  - {field}: `{values['before']}` -> `{values['after']}`")
            lines.append("")

    if not result.changed and not result.added_rows and not result.removed_rows:
        lines.append("")
        lines.append("No row-level changes detected. Ordering-only differences are ignored.")

    return "\n".join(lines) + "\n"


def build_status_page(metadata: dict[str, Any], history: list[dict[str, Any]]) -> str:
    recent = history[-10:][::-1]

    history_rows: list[str] = []
    if recent:
        for item in recent:
            added_preview = ", ".join(item.get("added_species_preview", [])) or "-"
            history_rows.append(
                "<tr>"
                f"<td>{item.get('timestamp', '-')}</td>"
                f"<td>{item.get('previous_count', '-')}</td>"
                f"<td>{item.get('current_count', '-')}</td>"
                f"<td>{item.get('added', 0)}</td>"
                f"<td>{item.get('removed', 0)}</td>"
                f"<td>{item.get('changed', 0)}</td>"
                f"<td>{added_preview}</td>"
                "</tr>"
            )
    else:
        history_rows.append("<tr><td colspan='7'>No changes recorded yet.</td></tr>")

    return f"""<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>TARP Data Monitor Status</title>
  <style>
    body {{ font-family: Segoe UI, Arial, sans-serif; margin: 24px; background:#f8f8f8; color:#1f2937; }}
    .card {{ background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin-bottom:16px; }}
    h1,h2 {{ margin:0 0 12px; }}
    table {{ width:100%; border-collapse:collapse; font-size:14px; }}
    th,td {{ border-bottom:1px solid #e5e7eb; padding:8px; text-align:left; vertical-align:top; }}
    th {{ background:#f3f4f6; }}
    code {{ background:#f3f4f6; padding:2px 6px; border-radius:4px; }}
  </style>
</head>
<body>
  <h1>TARP Data Monitor Status</h1>
  <div class=\"card\">
    <h2>Latest Status</h2>
    <p><strong>Last checked (UTC):</strong> {metadata.get('last_checked') or '-'}</p>
    <p><strong>Last changed (UTC):</strong> {metadata.get('last_changed') or '-'}</p>
    <p><strong>Current record count:</strong> {metadata.get('current_record_count', 0)}</p>
    <p><strong>Source:</strong> <code>{metadata.get('source_url', '-')}</code></p>
  </div>

  <div class=\"card\">
    <h2>Recent Change History</h2>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Previous</th>
          <th>Current</th>
          <th>Added</th>
          <th>Removed</th>
          <th>Changed</th>
          <th>Added Species Preview</th>
        </tr>
      </thead>
      <tbody>
        {''.join(history_rows)}
      </tbody>
    </table>
  </div>
</body>
</html>
"""


def generate_run_result_payload(result: MonitorResult, diff_path: Path) -> dict[str, Any]:
    return {
        "status": "success" if result.error is None else "failure",
        "checked_at": result.checked_at,
        "changed": result.changed,
        "source_url": result.source_url,
        "previous_count": result.previous_count,
        "current_count": result.current_count,
        "added_count": len(result.added_rows),
        "removed_count": len(result.removed_rows),
        "changed_count": len(result.changed_rows),
        "snapshot_path": result.snapshot_path,
        "diff_report_path": str(diff_path).replace("\\", "/"),
        "error": result.error,
    }


def bootstrap_master_if_needed() -> None:
    if MASTER_CSV.exists():
        return

    if not BASELINE_CSV.exists():
        raise FileNotFoundError(f"Baseline CSV not found: {BASELINE_CSV}")

    rows = read_csv_rows(BASELINE_CSV)
    write_csv_rows(MASTER_CSV, rows)


def monitor() -> MonitorResult:
    ensure_dirs()
    bootstrap_master_if_needed()

    checked_at = utc_now_iso()

    current_master_rows = read_csv_rows(MASTER_CSV)

    payload = fetch_json_with_retry(SOURCE_URL)
    raw_rows = find_best_row_list(payload)
    new_rows = [normalize_row(raw) for raw in raw_rows]

    added_rows, removed_rows, changed_rows = diff_rows(current_master_rows, new_rows)
    changed = bool(added_rows or removed_rows or changed_rows)

    snapshot_path: str | None = None
    changed_at: str | None = None

    if changed:
        write_csv_rows(MASTER_CSV, new_rows)
        ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
        snapshot_file = SNAPSHOT_DIR / f"tarp-{ts}.csv"
        write_csv_rows(snapshot_file, new_rows)
        snapshot_path = str(snapshot_file).replace("\\", "/")
        changed_at = checked_at

    return MonitorResult(
        changed=changed,
        checked_at=checked_at,
        changed_at=changed_at,
        source_url=SOURCE_URL,
        previous_count=len(current_master_rows),
        current_count=len(new_rows),
        added_rows=added_rows,
        removed_rows=removed_rows,
        changed_rows=changed_rows,
        snapshot_path=snapshot_path,
    )


def update_outputs(result: MonitorResult) -> None:
    metadata = load_metadata()
    history = load_history()

    metadata["source_url"] = result.source_url
    metadata["last_checked"] = result.checked_at
    metadata["current_record_count"] = result.current_count
    metadata["master_csv"] = str(MASTER_CSV).replace("\\", "/")

    if result.changed:
        metadata["last_changed"] = result.changed_at

        added_species_preview = [
            row["Kind of Fish (Species)"]
            for row in result.added_rows[:10]
            if row.get("Kind of Fish (Species)")
        ]

        history.append(
            {
                "timestamp": result.checked_at,
                "previous_count": result.previous_count,
                "current_count": result.current_count,
                "added": len(result.added_rows),
                "removed": len(result.removed_rows),
                "changed": len(result.changed_rows),
                "snapshot_path": result.snapshot_path,
                "added_species_preview": added_species_preview,
            }
        )

    write_json(METADATA_JSON, metadata)
    write_json(CHANGE_HISTORY_JSON, history)

    diff_md = build_diff_markdown(result)
    LATEST_DIFF_MD.write_text(diff_md, encoding="utf-8")

    run_result_payload = generate_run_result_payload(result, LATEST_DIFF_MD)
    write_json(RUN_RESULT_JSON, run_result_payload)

    STATUS_PAGE_HTML.write_text(build_status_page(metadata, history), encoding="utf-8")


def write_failure(error_message: str) -> None:
    checked_at = utc_now_iso()
    metadata = load_metadata()
    history = load_history()

    metadata["last_checked"] = checked_at
    write_json(METADATA_JSON, metadata)

    failure_result = {
        "status": "failure",
        "checked_at": checked_at,
        "changed": False,
        "source_url": SOURCE_URL,
        "error": error_message,
        "diff_report_path": str(LATEST_DIFF_MD).replace("\\", "/"),
    }
    write_json(RUN_RESULT_JSON, failure_result)

    failure_md = (
        "# Latest TARP Data Diff\n\n"
        f"- Checked at (UTC): {checked_at}\n"
        "- Result: FAILURE\n"
        f"- Error: `{error_message}`\n"
    )
    LATEST_DIFF_MD.write_text(failure_md, encoding="utf-8")
    STATUS_PAGE_HTML.write_text(build_status_page(metadata, history), encoding="utf-8")


def main() -> int:
    try:
        result = monitor()
        update_outputs(result)

        print(f"changed={str(result.changed).lower()}")
        print(f"previous_count={result.previous_count}")
        print(f"current_count={result.current_count}")
        print(f"added_count={len(result.added_rows)}")
        print(f"removed_count={len(result.removed_rows)}")
        print(f"changed_count={len(result.changed_rows)}")
        return 0
    except Exception as exc:  # noqa: BLE001
        write_failure(str(exc))
        print(f"Monitor failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
