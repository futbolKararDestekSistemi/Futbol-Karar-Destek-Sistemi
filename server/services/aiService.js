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
 *
 * Paket: @google/genai (Google'ın güncel SDK'sı, v1 API kullanır)
 */

const { GoogleGenAI } = require('@google/genai');

// Gemini istemcisini başlat (API anahtarı .env'den okunur)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
  "belirsizlik_yuzdesi": 0
}

Önemli Kurallar:
- Futbol dışı sorulara yanıt verme, sadece "Bu soruyu yanıtlayamam." de.
- Her zaman IFAB kural maddesine (örn. "IFAB Kural 12: Faul ve Nezaketsizce Davranış") atıfta bulun.
- Yanıtın SADECE JSON olsun, başka metin ekleme.
- belirsizlik_yuzdesi alanına 0-100 arası bir SAYI yaz, açıklama değil.
- Türkçe yanıt ver.`;

/**
 * Kullanıcının pozisyon metnini Gemini API'ye göndererek analiz eder.
 * @param {string} positionText - Kullanıcının anlattığı pozisyon
 * @returns {Promise<Object>} - Yapılandırılmış karar objesi
 */
const analyzePosition = async (positionText) => {
  // Girdi doğrulama
  if (!positionText || positionText.trim().length < 10) {
    throw new Error('Lütfen pozisyonu daha ayrıntılı açıklayın (en az 10 karakter).');
  }

  // API'ye istek gönder (@google/genai söz dizimi)
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-lite', // Teşhis ile doğrulandı — bu API key ile çalışan model
    contents: positionText,
    config: {
      temperature: 0.2,       // Düşük = tutarlı, kural odaklı yanıtlar
      maxOutputTokens: 1024,
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  const responseText = response.text;

  // Yanıttan JSON bloğunu çıkar (model bazen ```json ... ``` ekleyebilir)
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Yapay zeka geçerli bir JSON yanıtı döndürmedi.');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed;
};

module.exports = { analyzePosition };
