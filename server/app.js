/**
 * Futbol Karar Destek Sistemi — Express Ana Sunucu
 *
 * Bu dosya uygulamanın giriş noktasıdır (entry point).
 * Middleware'leri, route'ları ve veritabanı bağlantısını başlatır.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analysisRoutes = require('./routes/analysisRoutes');
const { initializeDatabase } = require('./models/database');

// .env dosyasındaki değişkenleri process.env'e yükle
dotenv.config();

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
