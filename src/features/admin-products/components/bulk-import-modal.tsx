"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function BulkImportModal({ onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleImport() {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setResult(data);

      if (data.success > 0) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Bulk Import Products</h2>

        {/* TEMPLATE DOWNLOAD */}

        <a
          href="/api/admin/products/import-template"
          className="text-blue-600 text-sm underline"
        >
          Download Excel Template
        </a>

        {/* FILE INPUT */}

        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="border p-2 w-full rounded"
        />

        <p className="text-sm text-gray-500">
          Upload Excel (.xlsx) or CSV file
        </p>

        {/* BUTTONS */}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleImport}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Importing..." : "Start Import"}
          </button>
        </div>

        {/* RESULT */}

        {result && (
          <div className="border-t pt-4 text-sm space-y-2">
            <p>Total: {result.total}</p>

            <p className="text-green-600">Success: {result.success}</p>

            <p className="text-red-600">Failed: {result.failed}</p>

            {result.errors?.length > 0 && (
              <div className="max-h-40 overflow-auto border p-2 rounded bg-gray-50">
                {result.errors.map((e: any, i: number) => (
                  <p key={i} className="text-red-500">
                    Row {e.row}: {e.error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
