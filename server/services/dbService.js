/**
 * Veritabanı Servisi — Analiz Kayıt ve Okuma İşlemleri
 *
 * Bu servis yalnızca veritabanı işlemlerinden sorumludur.
 * Tek Sorumluluk İlkesi: DB mantığını controller'dan ayırır.
 */

const { getDatabase } = require('../models/database');

/**
 * Yeni bir analiz sonucunu veritabanına kaydeder.
 * @param {Object} analysis - Kaydedilecek analiz verisi
 * @param {string} analysis.position - Kullanıcının girdiği pozisyon
 * @param {string} analysis.decision - AI kararı
 * @param {string} analysis.ruleRef - IFAB kural maddesi
 * @param {string} analysis.explanation - Kural açıklaması
 * @param {number} analysis.confidence - Belirsizlik yüzdesi
 * @returns {Object} - Kaydedilen satırın ID'si
 */
const saveAnalysisResult = (analysis) => {
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO analyses (position, decision, rule_ref, explanation, confidence)
    VALUES (@position, @decision, @ruleRef, @explanation, @confidence)
  `);

  const result = stmt.run({
    position: analysis.position,
    decision: analysis.decision,
    ruleRef: analysis.ruleRef || null,
    explanation: analysis.explanation,
    confidence: analysis.confidence || null,
  });

  return { id: result.lastInsertRowid };
};

/**
 * Tüm analiz geçmişini en yeniden en eskiye sıralı getirir.
 * @param {number} limit - Kaç kayıt getirileceği (varsayılan: 20)
 * @returns {Array} - Analiz kayıtları listesi
 */
const getAllAnalyses = (limit = 20) => {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT * FROM analyses
    ORDER BY created_at DESC
    LIMIT ?
  `);

  return stmt.all(limit);
};

/**
 * Karar türlerine göre istatistik getirir (grafik için).
 * @returns {Array} - [{decision, count}] formatında istatistik
 */
const getDecisionStats = () => {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT decision, COUNT(*) as count
    FROM analyses
    GROUP BY decision
    ORDER BY count DESC
  `);

  return stmt.all();
};

module.exports = { saveAnalysisResult, getAllAnalyses, getDecisionStats };
