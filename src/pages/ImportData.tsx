import { type ChangeEvent } from "react";

type Props = {
  onCsvLoaded: (csvText: string, fileName: string) => void;
};

export default function ImportData({ onCsvLoaded }: Props) {
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    onCsvLoaded(text, file.name);
  }

  return (
    <section>
      <div className="page-header">
        <h2>Import Data</h2>
        <p>Upload a CSV manually, or place your default file at `public/data/tarp.csv`.</p>
      </div>

      <div className="card">
        <h3>Upload CSV</h3>
        <p className="label">This runs locally in your browser. It does not upload data to a server.</p>
        <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Default GitHub Pages workflow</h3>
        <p>Put your data file here:</p>
        <pre>public/data/tarp.csv</pre>
        <p>Then the app will load it automatically on startup.</p>
      </div>
    </section>
  );
}
