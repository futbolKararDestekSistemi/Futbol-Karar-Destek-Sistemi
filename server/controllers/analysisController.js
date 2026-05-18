/**
 * Analiz Controller — HTTP İstek İşleyicisi
 *
 * Controller katmanı HTTP dünyası ile iş mantığı arasındaki köprüdür.
 * Görevi: İsteği al → servise ilet → sonucu HTTP yanıtı olarak gönder.
 * Tek Sorumluluk: Ne AI mantığı ne DB mantığı içerir, sadece koordine eder.
 */

const { analyzePosition } = require('../services/aiService');
const { saveAnalysisResult, getAllAnalyses, getDecisionStats } = require('../services/dbService');

/**
 * POST /api/analysis/analyze
 * Kullanıcının pozisyon metnini alır, AI ile analiz eder ve sonucu kaydeder.
 */
const analyze = async (req, res) => {
  const { position } = req.body;

  // Girdi kontrolü
  if (!position) {
    return res.status(400).json({ error: 'Pozisyon metni boş olamaz.' });
  }

  try {
    // 1) AI servise pozisyonu gönder → karar al
    const aiResult = await analyzePosition(position);

    // 2) Sonucu veritabanına kaydet
    const { id } = saveAnalysisResult({
      position,
      decision: aiResult.karar,
      ruleRef: aiResult.kural_maddesi,
      explanation: aiResult.aciklama,
      confidence: aiResult.belirsizlik_yuzdesi,
    });

    // 3) Başarılı yanıtı gönder
    return res.status(201).json({
      id,
      position,
      karar: aiResult.karar,
      kural_maddesi: aiResult.kural_maddesi,
      aciklama: aiResult.aciklama,
      belirsizlik_yuzdesi: aiResult.belirsizlik_yuzdesi,
    });
  } catch (error) {
    // Hata yönetimi — kullanıcıya anlamlı mesaj
    // eslint-disable-next-line no-console
    console.error('Analiz hatası:', error.message);
    return res.status(500).json({
      error: 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.',
    });
  }
};

/**
 * GET /api/analysis/history
 * Daha önce yapılan analizlerin listesini döndürür.
 */
const getHistory = (req, res) => {
  try {
    const analyses = getAllAnalyses(20);
    return res.json(analyses);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Geçmiş getirme hatası:', error.message);
    return res.status(500).json({ error: 'Geçmiş yüklenemedi.' });
  }
};

/**
 * GET /api/analysis/stats
 * Karar türlerine göre istatistik döndürür (grafik için).
 */
const getStats = (req, res) => {
  try {
    const stats = getDecisionStats();
    return res.json(stats);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('İstatistik hatası:', error.message);
    return res.status(500).json({ error: 'İstatistikler yüklenemedi.' });
  }
};

module.exports = { analyze, getHistory, getStats };
