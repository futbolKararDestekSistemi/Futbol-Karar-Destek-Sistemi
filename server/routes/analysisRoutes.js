/**
 * Analiz Route Tanımları
 *
 * Bu dosya /api/analysis altındaki tüm endpoint'leri tanımlar.
 * Görevi: URL + HTTP metodu → doğru controller fonksiyonu eşlemesi.
 */

const express = require('express');
const { analyze, getHistory, getStats } = require('../controllers/analysisController');

const router = express.Router();

// POST /api/analysis/analyze  → Yeni pozisyon analiz et
router.post('/analyze', analyze);

// GET  /api/analysis/history  → Analiz geçmişini getir
router.get('/history', getHistory);

// GET  /api/analysis/stats    → Karar istatistiklerini getir
router.get('/stats', getStats);

module.exports = router;
