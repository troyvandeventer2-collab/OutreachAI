const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure the db directory exists
const dbPath = process.env.DATABASE_PATH || './db/outreachai.db';
const dbDir = path.dirname(dbPath);

const absoluteDbDir = path.isAbsolute(dbDir) ? dbDir : path.join(__dirname, '..', dbDir);
if (!fs.existsSync(absoluteDbDir)) {
  fs.mkdirSync(absoluteDbDir, { recursive: true });
}

const absoluteDbPath = path.isAbsolute(dbPath) ? dbPath : path.join(__dirname, '..', dbPath);
console.log(`Connecting to SQLite database at: ${absoluteDbPath}`);

const db = new Database(absoluteDbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    subscription_tier TEXT DEFAULT 'free',
    emails_used INTEGER DEFAULT 0,
    bitcoin_tx_id TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT NOT NULL,
    prospect_name TEXT NOT NULL,
    prospect_company TEXT NOT NULL,
    prospect_title TEXT NOT NULL,
    what_they_sell TEXT NOT NULL,
    email_opener TEXT NOT NULL,
    email_followup TEXT NOT NULL,
    email_breakup TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`);

console.log('Database initialized successfully.');

module.exports = db;
