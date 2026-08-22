import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Action, State } from "../../hooks/taskReducer";
import { dbManager } from "../../utils/db";
import { useTranslation } from "react-i18next";


interface Props {
    state: State,
    dispatch: React.Dispatch<Action>,
}

export function SyncDbPage({
    state,
    dispatch,
}: Props) {
    const [t] = useTranslation();
    const tRef = useRef(t);

    useEffect(() => {
      tRef.current = t;
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0] ?? null);
    };

    const handleImport = async() => {
        if (!selectedFile) return;
        try {
          await dbManager.restoreBackup(selectedFile);
          alert(t('database.exportBackupSucceful'));
        } finally {
          console.log("Importing:", selectedFile.name);
        }
        
       
    };

    const handleExport = async() => {
        try {
          await dbManager.downloadBackup();
        } catch (error) {
          console.error("Database export failed:", error);
          alert(t('database.exportBackupError'));
        }
  };
  return (
    <main className="database-content">
      <section className="database-card">
        <h2>{t('database.sync')}</h2>
        <p className="description">
          {t('database.syncInfo')}
        </p>

        <div className="database-actions">
          <div className="action-box">
            <h3>{t('database.importTitle')}</h3>
            <p>{t('database.selectFileInfo')}</p>

            <label className="file-input">
              <span>{t('database.inputTitle')}</span>
              <input
                type="file"
                accept=".db,.sqlite,.sqlite3"
                onChange={handleFileChange}
              />
            </label>

            <span className="file-name">
              {selectedFile ? selectedFile.name : t('database.noFileChosenAlert')}
            </span>

            <button
              type="button"
              className="outline-button"
              disabled={!selectedFile}
              onClick={handleImport}
            >
              {t('database.import')}
            </button>
          </div>

          <div className="action-box">
            <h3>{t('database.exportTitle')}</h3>
            <p>{t('database.downloadDbInfo')}</p>

            <button
              type="button"
              className="outline-button export-button"
              onClick={handleExport}
            >
              {t('database.export')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
