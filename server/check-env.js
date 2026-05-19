// .env dosyasını fs ile manuel oku - dotenv bypass et
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
console.log('=== .env dosyası içeriği (ham) ===');
// Sadece KEY satırını göster
const lines = envContent.split('\n');
lines.forEach(line => {
  if (line.includes('GEMINI_API_KEY')) {
    console.log('KEY satırı:', line.trim());
    console.log('Değer:', line.split('=')[1]?.trim());
    console.log('Değer uzunluğu:', line.split('=')[1]?.trim().length);
  }
});
