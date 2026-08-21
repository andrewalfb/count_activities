import initSqlJs, { type Database } from "sql.js";
import { Hobby, HobbyTime, HobbyTimeDetail } from "../models/hobby";

export class DBManager {
  private db: Database | null = null;
  private initPromise: Promise<Database> | null = null;

  // IndexedDB config (DB bytes + anon id will live here)
  private DB_NAME = "sqljs_db";
  private STORE_NAME = "kv";

  private DB_BYTES_KEY = "sqljs_db_v1";
  private ANON_ID_KEY = "anon_id_v1";

  private async openIdb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, 1);

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async idbGet(key: string): Promise<any | null> {
    const idb = await this.openIdb();

    return new Promise((resolve, reject) => {
      const tx = idb.transaction(this.STORE_NAME, "readonly");
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  private async idbPut(key: string, value: any): Promise<void> {
    const idb = await this.openIdb();

    return new Promise((resolve, reject) => {
      const tx = idb.transaction(this.STORE_NAME, "readwrite");
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private async saveToIndexedDB() {
    const db = await this.getDb();
    const bytes = db.export();
    // Store bytes directly as Blob
    await this.idbPut(
      this.DB_BYTES_KEY,
      new Blob([this.bytesToBlob(bytes)], { type: "application/octet-stream" })
    );
  }

  private async loadFromIndexedDB(): Promise<Uint8Array | null> {
    const val = await this.idbGet(this.DB_BYTES_KEY);
    if (!val) return null;

    // val is a Blob
    const buffer = await (val as Blob).arrayBuffer();
    return new Uint8Array(buffer);
  }

  private async getDb(): Promise<Database> {
    if (!this.initPromise) await this.initDb();
    return this.db!;
  }


  private bytesToBlob(bytes: Uint8Array): Blob {
    const safeBytes = new Uint8Array(bytes.buffer.slice(0));

    return new Blob([safeBytes as BlobPart], { type: "application/octet-stream" });
  }

  async initDb() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const SQL = await initSqlJs({
        locateFile: (file) => `/sqljs-wasm/${file}`,
      });

      const existingBytes = await this.loadFromIndexedDB();
      if (existingBytes) {
        this.db = new SQL.Database(existingBytes);
        return this.db;
      }

      const database = new SQL.Database(new Uint8Array());
      this.db = database;

      database.exec("PRAGMA foreign_keys = ON;");

      database.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT NOT NULL PRIMARY KEY,
          name TEXT,
          timestamp INTEGER NOT NULL DEFAULT (CAST(strftime('%s') AS INTEGER))
        );
      `);

      database.exec(`
        CREATE TABLE IF NOT EXISTS hobbies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          FOREIGN KEY (userId) REFERENCES users(id)
        );
      `);

      database.exec(`
        CREATE TABLE IF NOT EXISTS hobby_time (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          hobbyId INTEGER NOT NULL,
          spentTime INTEGER NOT NULL,
          description TEXT,
          timestamp INTEGER NOT NULL DEFAULT (CAST(strftime('%s') AS INTEGER)),
          FOREIGN KEY (hobbyId) REFERENCES hobbies(id) ON DELETE CASCADE
        );
      `);

      database.exec(`CREATE INDEX IF NOT EXISTS idx_hobbies_userId ON hobbies(userId);`);
      database.exec(`CREATE INDEX IF NOT EXISTS idx_hobby_time_hobbyId ON hobby_time(hobbyId);`);
      database.exec(`CREATE INDEX IF NOT EXISTS idx_hobby_time_timestamp ON hobby_time(timestamp);`);

      await this.idbPut(
        this.DB_BYTES_KEY,
        new Blob([database.export() as unknown as BlobPart], { type: "application/octet-stream" })
      );

      return database;
    })();

    return this.initPromise;
  }

  // auth functions
  async createUser(userId: string, name: string) {
    const db = await this.getDb();

    const insert = db.prepare("INSERT INTO users (id, name) VALUES (?, ?)");
    insert.run([userId, name]);
    insert.free();

    await this.createHobbyExamples(userId);
    await this.saveToIndexedDB();
  }

  async createHobbyExamples(userId: string) {
    const db = await this.getDb();

    const insert = db.prepare(
      "INSERT INTO hobbies (userId, name, description) VALUES (?, ?, ?)"
    );
    insert.run([userId, "English", "studying for fan."]);
    insert.run([userId, "React", "frontend developer skill."]);
    insert.run([userId, "Armenian", "preparing to exam."]);
    insert.free();
  }


  private async anonIdExistsInDb(anonId: string): Promise<boolean> {
    const db = await this.getDb();
    const stmt = db.prepare("SELECT id FROM users WHERE id = ? LIMIT 1");
    stmt.bind([anonId]);
    const exists = stmt.step(); // true if at least one row
    stmt.free();
    return exists;
  }

  private async getAnonIdFromIdb(): Promise<string | null> {
    const v = await this.idbGet(this.ANON_ID_KEY);
    return typeof v === "string" ? v : null;
  }

  private async setAnonIdInIdb(anonId: string): Promise<void> {
    await this.idbPut(this.ANON_ID_KEY, anonId);
  }

  async initAnonAuth(name = "anonym") {
    await this.initDb();

    let anonId = await this.getAnonIdFromIdb();

    if (!anonId) {
      anonId = Math.random().toString(36).slice(2);
      await this.createUser(anonId, name);
      await this.setAnonIdInIdb(anonId);
      return anonId;
    }

    // Safety: if DB got cleared but anon_id persisted, ensure user exists
    const exists = await this.anonIdExistsInDb(anonId);
    if (!exists) {
      await this.createUser(anonId, name);
    }

    return anonId;
  }

  private async getAnonId(): Promise<string> {
    const anonId = await this.getAnonIdFromIdb(); // your existing method
    if (!anonId) {
      // Ensure auth exists (creates anon user in DB if missing)
      await this.initAnonAuth();
      return (await this.getAnonIdFromIdb())!;
    }
    return anonId;
  }


  // flow functions 

  async getHobbiesList(): Promise<Hobby[]> {
    const userId = await this.getAnonId();
    const db = await this.getDb();

    const stmt = db.prepare(
      "SELECT id, name, description FROM hobbies WHERE userId = ? ORDER BY name DESC"
    );
    stmt.bind([userId]);

    const colNames = stmt.getColumnNames();
    const rows: Hobby[] = [];
    while (stmt.step()) {
      const row = stmt.get() as any;
      const obj = Object.fromEntries(colNames.map((c: string, i: number) => [c, row[i]]));
      rows.push(new Hobby(Number(obj.id), String(obj.name), String(obj.description)));
    };
    stmt.free();

    return rows;
  }

  async setHobbyTime(hobbyId: number, spentTime: number, description: string) {
    const db = await this.getDb();
    const stmt = db.prepare(
      'INSERT INTO hobby_time (hobbyId, spentTime, description) VALUES(?, ?, ?)'
    );
    stmt.run([hobbyId, spentTime, description]);
    stmt.free;
    await this.saveToIndexedDB();
  }

  async addHobby(name: string, description: string): Promise<Hobby> {
    const db = await this.getDb();
    const userId = await this.getAnonId();
    const stmt = db.prepare(
      'INSERT INTO hobbies (userId, name, description) VALUES (?, ?, ?)'
    );

    stmt.run([userId, name, description]);

    const stmtId = db.exec('SELECT last_insert_rowid() AS id');
    const newId = stmtId[0].values[0][0];
    console.log('newId:', newId);
    stmt.free;
    await this.saveToIndexedDB();
    return new Hobby(Number(newId), name, description);
  }
/* work variant without future sync 
  async deleteHobby(id: number) {
    const db = await this.getDb();
    const stmt = db.prepare(`
      DELETE FROM hobbies WHERE id = ?   
    `);

    const res = stmt.run([id]);
    stmt.free();
    await this.saveToIndexedDB();
    return res;
  }
  */
 private sqlLiteral(v: unknown): string {
  if (v === null) return 'NULL';
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  const s = String(v);
  return `'${s.replace(/'/g, "''")}'`;
}

private interpolateSql(template: string, params: unknown[]): string {
  let i = 0;
  return template.replace(/\?/g, () => this.sqlLiteral(params[i++]));
}

async deleteHobby(id: number) {
  const db = await this.getDb();

  const sql = `DELETE FROM hobbies WHERE id = ?`;
  const params = [id];

  const stmt = db.prepare(sql);

  // journal "full" SQL with bound values applied
  const executedSqlForJournal = this.interpolateSql(sql, params);
  console.info("JOURNAL:", executedSqlForJournal);

  const res = stmt.run(params);

  stmt.free(); // <-- call with parentheses
  await this.saveToIndexedDB();
  return res;
}

/* work copy without log
  async updateHobby(id: number, name: string, description: string) {
    const db = await this.getDb();
    const stmt = db.prepare(`
      UPDATE hobbies 
        SET name = ?,
            description = ?
      WHERE id = ?
    `);
    const params = [name, description, id];
    stmt.bind(params);
    console.info(`sql: ${stmt.getSQL()} params: ${params}`)
    stmt.free;
    await this.saveToIndexedDB();
    return;
  }
  */

  async updateHobby(id: number, name: string, description: string) {
    const db = await this.getDb();

    const sql = `
      UPDATE hobbies
        SET name = ?,
            description = ?
      WHERE id = ?
    `;

    const params = [name, description, id];

    const stmt = db.prepare(sql);

    // 1) Execute normally (the safe/bound way)
    stmt.bind(params);

    // Depending on how your other code works, choose ONE:
    // Option A (common in sql.js patterns for SELECT): stmt.step()
    // Option B (often used for non-SELECT): stmt.run()
    //
    // If you already have working UPDATE code elsewhere, follow that.
    if (typeof stmt.run === "function") {
      stmt.run(params); // if your version supports run with params
    } else {
      // For bind + step style:
      while (stmt.step()) { /* no rows expected for UPDATE */ }
    }

    // 2) Journal full SQL with substituted values
    const journalSql = this.interpolateSql(sql, params);
    console.info("JOURNAL:", journalSql);

    stmt.free();
    await this.saveToIndexedDB();
}

  // statistics functions

  async getHobbyTimeList(): Promise<HobbyTime[]> {
    const db = await this.getDb();
    const userId = await this.getAnonId();
    const stmt = db.prepare(`
      SELECT 
      * 
      FROM hobbies h, hobby_time ht 
      WHERE h.userId = ? 
        AND h.id = ht.hobbyId
        AND ht.timestamp >= CAST(strftime('%s','now','start of day') AS INTEGER)
        AND ht.timestamp <  CAST(strftime('%s','now','start of day','+1 day') AS INTEGER)
    `);
    stmt.bind([userId]);

    const rows: HobbyTime[] = [];
    while (stmt.step()) {
      const obj = stmt.getAsObject();
      rows.push(new HobbyTime(String(obj.name), String(obj.description), Number(obj.spentTime), Number(obj.timestamp)));
    };
    stmt.free;
    return rows;
  };


  async getDetailsSpentTimes(hobbyId: number) {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT 
        h.name AS hobby,
        ht.description AS description, 
        ht.spentTime AS spentTime 
      FROM hobby_time ht
      JOIN hobbies h ON ht.hobbyId = h.id 
      WHERE ht.hobbyId = ? 
        AND ht.timestamp >= CAST(strftime('%s','now','start of day') AS INTEGER)
        AND ht.timestamp <  CAST(strftime('%s','now','start of day','+1 day') AS INTEGER)
    `);
     stmt.bind([hobbyId]);

      const rows: HobbyTimeDetail[] = [];
      while (stmt.step()) {
        const obj = stmt.getAsObject();
        rows.push(new HobbyTimeDetail(String(obj.hobby), String(obj.description), Number(obj.spentTime)));
      };
      stmt.free;
    return rows;
  }

  async getSpentTimeRange(
    startDate: Date,
    endDate: Date
  ): Promise<HobbyTimeDetail[]> {
    const db = await this.getDb();
    const start = Math.floor(startDate.getTime() / 1000);
    const end = Math.floor(endDate.getTime() / 1000);

    const stmt = db.prepare(`
      SELECT
        SUM(ht.spentTime) AS spentTime,
        h.name AS name,
        h.description AS description
      FROM hobbies h
      JOIN hobby_time ht ON h.id = ht.hobbyId
      WHERE ht.timestamp >= ?
        AND ht.timestamp < ?
      GROUP BY h.id, h.name, h.description
    `);

    const rows: HobbyTimeDetail[] = [];

    try {
      stmt.bind([start, end]);

      while (stmt.step()) {
        const obj = stmt.getAsObject();

        rows.push(
          new HobbyTimeDetail(
            String(obj.name),
            String(obj.description),
            Number(obj.spentTime)
          )
        );
      }
    } finally {
      stmt.free();
    }

    return rows;
  }


  // import export db
   async downloadBackup(): Promise<void> {
    const db = await this.getDb();
    const bytes = db.export();

    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);

    const blob = new Blob([buffer], {
      type: "application/x-sqlite3",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `my-app-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.sqlite`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }
  
   async restoreBackup(file: File): Promise<void> {
    if (!file) {
      throw new Error("No backup file selected.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const SQL = await initSqlJs({
      locateFile: () => "/sql-wasm.wasm",
    });

    const restoredDb = new SQL.Database(bytes);

    // Replace the in-memory database
    if (this.db) {
      this.db.close();
    }

    this.db = restoredDb;

    // Persist the restored database in IndexedDB
    await this.saveToIndexedDB();
  }
}
