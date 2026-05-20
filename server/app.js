/**
 * Futbol Karar Destek Sistemi — Express Ana Sunucu
 *
 * Bu dosya uygulamanın giriş noktasıdır (entry point).
 * Middleware'leri, route'ları ve veritabanı bağlantısını başlatır.
 *
 * ÖNEMLİ: dotenv.config() diğer tüm require'lardan ÖNCE çağrılmalıdır.
 * Aksi halde modüller yüklenirken process.env değerleri henüz tanımlı
 * olmaz ve API anahtarı 'undefined' olarak geçer.
 */

// .env dosyasını EN ÖNCE yükle — hiçbir modül bundan önce gelmemeli
const dotenv = require('dotenv');
dotenv.config();

// Artık process.env.GEMINI_API_KEY hazır, modüller güvenle yüklenebilir
const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');
const { initializeDatabase } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// JSON formatındaki istekleri okuyabilmek için
app.use(express.json());

// Frontend'in (React) bu sunucuya istek atmasına izin ver
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  })
);

// ─── Route'lar ────────────────────────────────────────────────────────────────

// /api/analysis altındaki tüm istekler analysisRoutes'a yönlenir
app.use('/api/analysis', analysisRoutes);

// Sunucunun çalışıp çalışmadığını kontrol etmek için basit endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sunucu çalışıyor ✅' });
});

// Bilinmeyen route'lar için 404 yanıtı
app.use((req, res) => {
  res.status(404).json({ error: 'Bu endpoint bulunamadı.' });
});

// ─── Başlatma ─────────────────────────────────────────────────────────────────

// Önce veritabanını hazırla, sonra sunucuyu başlat
initializeDatabase();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
