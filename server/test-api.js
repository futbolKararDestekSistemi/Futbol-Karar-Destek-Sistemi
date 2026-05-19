/**
 * Backend API Test Script
 * Tüm endpoint'leri sırasıyla test eder.
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   Futbol Karar Destek Sistemi — API Testleri    ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // ─── Test 1: Health Check ─────────────────────────────────
  console.log('🧪 Test 1: GET /api/health');
  try {
    const res = await request('GET', '/api/health');
    console.log(`   Durum: ${res.status}`);
    console.log(`   Yanıt:`, res.body);
    console.log(res.status === 200 ? '   ✅ BAŞARILI\n' : '   ❌ BAŞARISIZ\n');
  } catch (err) {
    console.log('   ❌ HATA:', err.message, '\n');
  }

  // ─── Test 2: Boş pozisyon gönder (400 bekliyoruz) ─────────
  console.log('🧪 Test 2: POST /api/analysis/analyze — Boş pozisyon (400 bekleniyor)');
  try {
    const res = await request('POST', '/api/analysis/analyze', { position: '' });
    console.log(`   Durum: ${res.status}`);
    console.log(`   Yanıt:`, res.body);
    console.log(res.status === 400 ? '   ✅ BAŞARILI (doğru hata kodu)\n' : '   ❌ BAŞARISIZ\n');
  } catch (err) {
    console.log('   ❌ HATA:', err.message, '\n');
  }

  // ─── Test 3: Gerçek pozisyon analizi (Gemini API) ─────────
  console.log('🧪 Test 3: POST /api/analysis/analyze — Gerçek pozisyon analizi');
  console.log('   ⏳ Gemini API yanıtı bekleniyor...');
  try {
    const res = await request('POST', '/api/analysis/analyze', {
      position: 'Ceza sahasi icinde savunma oyuncusu rakip forvete arkadan kayarak mudahale etti ve topa degmeden oyuncuyu dusurdu.',
    });
    console.log(`   Durum: ${res.status}`);
    console.log(`   Yanıt:`, JSON.stringify(res.body, null, 2));
    console.log(res.status === 201 ? '   ✅ BAŞARILI\n' : '   ❌ BAŞARISIZ\n');
  } catch (err) {
    console.log('   ❌ HATA:', err.message, '\n');
  }

  // ─── Test 4: Geçmiş listesi ───────────────────────────────
  console.log('🧪 Test 4: GET /api/analysis/history');
  try {
    const res = await request('GET', '/api/analysis/history');
    console.log(`   Durum: ${res.status}`);
    console.log(`   Kayıt sayısı: ${Array.isArray(res.body) ? res.body.length : 'N/A'}`);
    console.log(res.status === 200 ? '   ✅ BAŞARILI\n' : '   ❌ BAŞARISIZ\n');
  } catch (err) {
    console.log('   ❌ HATA:', err.message, '\n');
  }

  // ─── Test 5: İstatistikler ────────────────────────────────
  console.log('🧪 Test 5: GET /api/analysis/stats');
  try {
    const res = await request('GET', '/api/analysis/stats');
    console.log(`   Durum: ${res.status}`);
    console.log(`   Yanıt:`, res.body);
    console.log(res.status === 200 ? '   ✅ BAŞARILI\n' : '   ❌ BAŞARISIZ\n');
  } catch (err) {
    console.log('   ❌ HATA:', err.message, '\n');
  }

  // ─── Test 6: 404 bilinmeyen endpoint ──────────────────────
  console.log('🧪 Test 6: GET /api/bilinmeyen — 404 bekleniyor');
  try {
    const res = await request('GET', '/api/bilinmeyen');
    console.log(`   Durum: ${res.status}`);
    console.log(`   Yanıt:`, res.body);
    console.log(res.status === 404 ? '   ✅ BAŞARILI (doğru 404)\n' : '   ❌ BAŞARISIZ\n');
  } catch (err) {
    console.log('   ❌ HATA:', err.message, '\n');
  }

  console.log('═══════════════════════════════════════════════════');
  console.log('   Testler tamamlandı! 🏁');
  console.log('═══════════════════════════════════════════════════');
}

runTests();
