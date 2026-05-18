/**
 * Girdi Doğrulama Yardımcı Fonksiyonları (Utilities)
 *
 * DRY ilkesi: Bu fonksiyonlar birden fazla yerde kullanılabilir.
 * Merkezi tutarak tekrar yazmayı önleriz.
 */

/**
 * Metnin futbolla ilgili olup olmadığını basitçe kontrol eder.
 * Gelişmiş filtreleme AI tarafında yapılır; bu ön filtreleme içindir.
 * @param {string} text - Kontrol edilecek metin
 * @returns {boolean} - Geçerli uzunluktaysa true
 */
const isValidPositionText = (text) => {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= 10 && trimmed.length <= 2000;
};

/**
 * Sayısal limit değerini güvenli şekilde ayrıştırır.
 * @param {any} value - Ayrıştırılacak değer
 * @param {number} defaultValue - Geçersizse kullanılacak varsayılan
 * @returns {number}
 */
const parseLimit = (value, defaultValue = 20) => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 100) return defaultValue;
  return parsed;
};

module.exports = { isValidPositionText, parseLimit };
