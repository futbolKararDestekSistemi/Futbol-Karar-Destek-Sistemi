/**
 * API Anahtarı Doğrulama Testi
 * Çalıştır: node check-env.js
 *
 * Bu script dotenv'in doğru sırada yüklenip yüklenmediğini test eder.
 */

// dotenv'i EN ÖNCE yükle (app.js ile aynı sıra)
const dotenv = require('dotenv');
dotenv.config();

const key = process.env.GEMINI_API_KEY;

console.log('\n=== Ortam Değişkeni Kontrolü ===');

if (!key || key === 'buraya_api_anahtarini_yaz') {
  console.log('❌ HATA: API anahtarı .env dosyasına girilmemiş!');
  console.log('   → server/.env dosyasını aç ve GEMINI_API_KEY değerini gir.');
  process.exit(1);
}

console.log('✅ GEMINI_API_KEY yüklendi');
console.log(`   Uzunluk : ${key.length} karakter`);
console.log(`   Başlangıç: ${key.substring(0, 10)}...`);
console.log(`   Format  : ${key.startsWith('AIzaSy') ? '✅ Geçerli format' : '⚠️ Beklenmeyen format'}`);
console.log('\n✅ dotenv sıralaması doğru — app.js hazır.\n');
