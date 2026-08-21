import React, { ChangeEvent, useState } from "react";
import { Action, State } from "../../hooks/taskReducer";
import { dbManager } from "../../utils/db";


interface Props {
    state: State,
    dispatch: React.Dispatch<Action>,
}

export function SyncDbPage({
    state,
    dispatch,
}: Props) {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0] ?? null);
    };

    const handleImport = async() => {
        if (!selectedFile) return;
        try {
          await dbManager.restoreBackup(selectedFile)
        } finally {
          console.log("Importing:", selectedFile.name);
        }
        
       
    };

    const handleExport = async() => {
        try {
          await dbManager.downloadBackup();
        } catch (error) {
          console.error("Database export failed:", error);
          alert("The database backup could not be exported.");
        }
  };
  return (
    <main className="database-content">
      <section className="database-card">
        <h2>Database</h2>
        <p className="description">
          Import an existing database or export your current data.
        </p>

        <div className="database-actions">
          <div className="action-box">
            <h3>Import Database</h3>
            <p>Select a database file from your computer.</p>

            <label className="file-input">
              <span>Choose File</span>
              <input
                type="file"
                accept=".db,.sqlite,.sqlite3"
                onChange={handleFileChange}
              />
            </label>

            <span className="file-name">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>

            <button
              type="button"
              className="outline-button"
              disabled={!selectedFile}
              onClick={handleImport}
            >
              Import DB
            </button>
          </div>

          <div className="action-box">
            <h3>Export Database</h3>
            <p>Download a backup of your current database.</p>

            <button
              type="button"
              className="outline-button export-button"
              onClick={handleExport}
            >
              Export DB
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .database-content {
          width: 100%;
          min-height: 240px;
          padding: 24px;
          box-sizing: border-box;
          background: #ffffff;
          color: #4b5563;
          font-family: Arial, sans-serif;
        }

        .database-card {
          max-width: 760px;
          margin: 0 auto;
          padding: 22px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
        }

        h2 {
          margin: 0;
          color: #374151;
          font-size: 18px;
          font-weight: 600;
        }

        .description {
          margin: 6px 0 20px;
          color: #9ca3af;
          font-size: 13px;
        }

        .database-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .action-box {
          min-height: 160px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fafafa;
          box-sizing: border-box;
        }

        h3 {
          margin: 0 0 8px;
          color: #4b5563;
          font-size: 14px;
          font-weight: 600;
        }

        .action-box p {
          margin: 0 0 16px;
          color: #9ca3af;
          font-size: 12px;
        }

        .file-input {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          padding: 0 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          background: #fff;
          color: #6b7280;
          font-size: 12px;
          cursor: pointer;
        }

        .file-input input {
          display: none;
        }

        .file-name {
          display: block;
          min-height: 16px;
          margin: 8px 0 14px;
          overflow: hidden;
          color: #9ca3af;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .outline-button {
          height: 32px;
          padding: 0 18px;
          border: 1px solid #ff9800;
          border-radius: 7px;
          background: #fffaf2;
          color: #ed8b00;
          font-size: 12px;
          cursor: pointer;
        }

        .outline-button:hover {
          background: #fff1d6;
        }

        .outline-button:disabled {
          border-color: #d1d5db;
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .export-button {
          width: 100%;
          margin-top: 25px;
        }

        @media (max-width: 600px) {
          .database-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
};
