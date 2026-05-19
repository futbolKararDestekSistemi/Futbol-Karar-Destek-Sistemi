require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function detailedTest() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  try {
    const result = await model.generateContent('Merhaba! Sadece "ok" yaz.');
    console.log('✅ BAŞARILI:', result.response.text().trim());
  } catch (err) {
    console.error('❌ TAM HATA MESAJI:');
    console.error(err.message);
  }
}

detailedTest();
