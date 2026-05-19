/**
 * Yapay Zeka Servisi — Google Gemini API Entegrasyonu
 *
 * Bu servis kullanıcının girdiği pozisyon metnini alır,
 * Gemini API'ye gönderir ve yapılandırılmış bir karar döndürür.
 *
 * Kullanılan AI Teknikleri:
 * - Prompt Engineering: Hakem kimliği ve kural çerçevesi
 * - Structured Output: JSON formatında yanıt isteme
 * - Temperature Control: 0.2 — tutarlı, kural odaklı yanıtlar
 * - Few-Shot Prompting: Örnek senaryo → doğru karar formatı
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini istemcisini başlat (API anahtarı .env'den okunur)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Gemini'ye gönderilecek sistem komutu (System Prompt).
 * Bu prompt yapay zekanın kimliğini ve davranışını belirler.
 */
const SYSTEM_PROMPT = `Sen TFF/IFAB oyun kurallarını eksiksiz bilen deneyimli bir VAR hakemisin.
Kullanıcının anlattığı futbol pozisyonunu analiz et ve YALNIZCA aşağıdaki JSON formatında yanıt ver:

{
  "karar": "Sarı Kart | Kırmızı Kart | Penaltı | Serbest Vuruş | Ofsayt | Taç | Kale Vuruşu | Köşe Vuruşu | Devam Et | Gol Geçerli | Gol İptal",
  "kural_maddesi": "IFAB Kural [numara]: [kural adı]",
  "aciklama": "Kararının gerekçesi, hangi eylemi neden kurala aykırı bulduğunu açıkla.",
  "belirsizlik_yuzdesi": 0-100 arası sayı (0=kesin karar, 100=tamamen belirsiz)
}

Önemli Kurallar:
- Futbol dışı sorulara yanıt verme, sadece "Bu soruyu yanıtlayamam." de.
- Her zaman IFAB kural maddesine (örn. "IFAB Kural 12: Faul ve Nezaketsizce Davranış") atıfta bulun.
- Yanıtın SADECE JSON olsun, başka metin ekleme.
- Türkçe yanıt ver.`;

/**
 * Kullanıcının pozisyon metnini Gemini API'ye göndererek analiz eder.
 * @param {string} positionText - Kullanıcının anlattığı pozisyon
 * @returns {Promise<Object>} - Yapılandırılmış karar objesi
 */
const analyzePosition = async (positionText) => {
  // Girdi doğrulama — futbol dışı ve çok kısa metinleri filtrele
  if (!positionText || positionText.trim().length < 10) {
    throw new Error('Lütfen pozisyonu daha ayrıntılı açıklayın (en az 10 karakter).');
  }

  // Gemini modelini yapılandır
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.2,        // Düşük = tutarlı, yaratıcılıktan uzak yanıtlar
      maxOutputTokens: 1024,
      responseMimeType: 'application/json', // JSON formatında yanıt iste
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  // API'ye istek gönder
  const result = await model.generateContent(positionText);
  const responseText = result.response.text();

  // JSON'u ayrıştır ve döndür
  const parsed = JSON.parse(responseText);
  return parsed;
};

module.exports = { analyzePosition };
