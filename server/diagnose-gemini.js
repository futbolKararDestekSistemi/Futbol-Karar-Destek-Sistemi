/**
 * Gemini Model Teşhis Scripti
 * Hangi modelin bu API key ile çalıştığını test eder.
 * Çalıştır: node diagnose-gemini.js
 */

const dotenv = require('dotenv');
dotenv.config();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TEST_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.0-pro',
  'gemini-pro',
];

const TEST_PROMPT = 'Merhaba, çalışıyor musun? Sadece "evet" yaz.';

async function testModel(modelName) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: TEST_PROMPT,
    });
    const text = response.text?.substring(0, 50) || '(boş yanıt)';
    console.log(`✅ ${modelName} → ÇALIŞIYOR: "${text}"`);
    return true;
  } catch (err) {
    const msg = err.message?.substring(0, 80) || err;
    console.log(`❌ ${modelName} → HATA: ${msg}`);
    return false;
  }
}

async function main() {
  console.log('\n🔍 Gemini Model Teşhisi Başlıyor...\n');
  console.log(`API Key: ${process.env.GEMINI_API_KEY?.substring(0, 12)}...`);
  console.log('─'.repeat(60));

  let workingModel = null;
  for (const model of TEST_MODELS) {
    const ok = await testModel(model);
    if (ok && !workingModel) workingModel = model;
  }

  console.log('─'.repeat(60));
  if (workingModel) {
    console.log(`\n✅ Kullanılacak model: "${workingModel}"`);
    console.log('→ aiService.js içindeki model adını bununla güncelle.\n');
  } else {
    console.log('\n❌ Hiçbir model çalışmıyor!');
    console.log('→ API key geçersiz olabilir veya kota tamamen dolmuş olabilir.');
    console.log('→ https://aistudio.google.com adresinden yeni bir key al.\n');
  }
}

main();
