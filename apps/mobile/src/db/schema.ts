import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db: any = null;

if (Platform.OS !== 'web') {
  try {
    db = SQLite.openDatabaseSync('harvestlink.db');
  } catch (error) {
    console.error('Failed to open SQLite database:', error);
  }
}

export const initDB = () => {
  if (Platform.OS === 'web' || !db) return;
  
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pending_listings (
      local_id TEXT PRIMARY KEY,
      crop_type TEXT NOT NULL,
      quantity_kg REAL NOT NULL,
      harvest_date TEXT NOT NULL,
      storage_method TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      synced INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

export default db;
