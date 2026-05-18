/**
 * Veritabanı Modeli — SQLite Bağlantısı ve Şema Oluşturma
 *
 * Bu dosya veritabanını başlatır ve tablolar yoksa oluşturur.
 * Tek Sorumluluk: Yalnızca DB bağlantısı ve şema yönetimi.
 */

const Database = require('better-sqlite3');
const path = require('path');

// Veritabanı dosyasının konumu: server/data/futbol.db
const DB_PATH = path.join(__dirname, '..', 'data', 'futbol.db');

let db;

/**
 * Veritabanını başlatır ve gerekli tabloları oluşturur.
 * Uygulama ilk açıldığında bir kere çağrılır.
 */
const initializeDatabase = () => {
  db = new Database(DB_PATH);

  // Performans için WAL (Write-Ahead Logging) modunu etkinleştir
  db.pragma('journal_mode = WAL');

  // Analizlerin saklandığı tablo
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      position    TEXT    NOT NULL,
      decision    TEXT    NOT NULL,
      rule_ref    TEXT,
      explanation TEXT    NOT NULL,
      confidence  REAL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Futbol kural kategorileri tablosu (IFAB kural maddeleri)
  db.exec(`
    CREATE TABLE IF NOT EXISTS rule_categories (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT NOT NULL,
      ifab_ref TEXT
    );
  `);

  // eslint-disable-next-line no-console
  console.log('✅ Veritabanı hazır');
};

/**
 * Veritabanı bağlantısını döndürür.
 * Diğer servisler bu fonksiyon aracılığıyla DB'ye erişir.
 * @returns {Database} SQLite veritabanı bağlantısı
 */
const getDatabase = () => {
  if (!db) {
    throw new Error('Veritabanı henüz başlatılmadı. initializeDatabase() çağrılmalı.');
  }
  return db;
};

module.exports = { initializeDatabase, getDatabase };
