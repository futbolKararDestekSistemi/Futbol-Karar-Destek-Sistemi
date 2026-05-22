# ⚽ Futbol Karar Destek Sistemi (AI-Powered Referee Assistant)

Kullanıcının metin olarak girdiği futbol maç pozisyonlarını **TFF/IFAB güncel kural kitapçığına** göre analiz eden, yapay zeka destekli karar (kart, atış türü vb.) ve kural açıklaması sunan web uygulaması.

Proje, modern yazılım mühendisliği standartlarına uygun olarak **Clean Architecture (Temiz Mimari)** prensiplerine göre yapılandırılmıştır. İş mantığı (Domain), veri erişimi (Infrastructure) ve sunum (Presenter) katmanları birbirinden izole edilmiştir.

---

## 🎯 Projenin Amacı ve Çözdüğü Problemler

Geleneksel futbol kural tartışmalarında taraftar ve öğrenciler büyük problemlerle karşılaşır: _"Bu pozisyonda doğru karar ne olmalıydı?"_, _"Hangi IFAB kuralı geçerli?"_. Bu sistem, yapay zeka ile bu soruları anında ve güvenilir şekilde yanıtlar.

1. **Anlık Kural Analizi**: Kullanıcının metin olarak girdiği pozisyonu Gemini AI analiz eder, TFF/IFAB kural kitapçığına dayanarak karar verir (Sarı Kart, Kırmızı Kart, Penaltı, Serbest Vuruş, Ofsayt, vb.).
2. **Kural Referansı**: Her karar için ilgili IFAB kural maddesi (örn. _"IFAB Kural 12: Faul ve Nezaketsizce Davranış"_) gösterilir.
3. **Güven Oranı**: Her analizde yapay zekanın kararına olan güven yüzdesi bar chart ile görselleştirilir.
4. **Geçmiş Takibi**: Yapılan tüm analizler SQLite veritabanında saklanır ve geçmiş sekmesinden incelenebilir.
5. **İstatistik Paneli**: Karar türlerine göre dağılım grafiği ile en sık verilen kararlar takip edilir.

---

## 🧩 Temel Modüller ve Yetenekler

Platform, üç ana sekmeden oluşan tek ekranlı bir arayüze sahiptir:

### 🔍 Pozisyon Analizi
- Kullanıcı pozisyonu metin olarak girer (10–2000 karakter arası).
- Girdi backend'e gönderilir ve Gemini AI tarafından analiz edilir.
- Sonuç; **karar**, **kural maddesi**, **açıklama** ve **güven oranı** olarak gösterilir.
- Her karar türü için özel ikonlar kullanılır (🟥 Penaltı, 🟨 Sarı Kart, ⚽ Gol Geçerli vb.).

### 📋 Analiz Geçmişi
- Son 20 analiz otomatik olarak veritabanına kaydedilir.
- Geçmiş sekmesinde daha önce yapılan analizlerin tamamı tarih sırasıyla listelenir.

### 📊 İstatistik Paneli
- Karar türlerine göre toplam dağılım (yatay bar chart).
- Toplam analiz sayısı, farklı karar türü sayısı ve en sık verilen karar özet kartlarında gösterilir.

### 🤖 Gemini AI Entegrasyonu
- Pozisyon analizi için **Google Gemini 2.0 Flash Lite** modeli kullanılır.
- Sistem, **Prompt Engineering** tekniği ile yapay zekaya deneyimli bir VAR hakemi kimliği verir.
- **Structured Output**: Yanıt her zaman JSON formatında alınır.
- **Temperature Control**: `0.2` — tutarlı, kural odaklı yanıtlar üretilir.
- Ücretsiz kota aşıldığında (429 Rate Limit) kullanıcıya anlaşılır bir hata mesajı gösterilir.

---

## 🏗️ Mimari Tasarım ve Teknoloji Yığını

Proje, kodun sürdürülebilir, test edilebilir ve genişletilebilir olması amacıyla katmanlı mimari (Clean Architecture) standardında yazılmıştır.

### Kullanılan Teknolojiler

| Katman | Teknoloji | Görevi / Rolü |
|---|---|---|
| **Backend Framework** | Express.js 5 (Node.js) | Yüksek performanslı, asenkron ve tip güvenli RESTful API altyapısı. |
| **Yapay Zeka (AI)** | Google Gemini 2.0 Flash Lite | IFAB kural kitapçığına uygun pozisyon analizi; JSON formatında yapılandırılmış karar üretimi. |
| **Veritabanı** | SQLite 3 (better-sqlite3) | Hafif, sunucusuz ilişkisel veritabanı yönetimi ve model katmanı. WAL modu ile yüksek performans. |
| **Veri Doğrulama** | validators.js (Custom) | Girdi ve çıktı verilerinin çalışma zamanında (runtime) kontrol edilmesi. |
| **Arayüz (Frontend)** | React 19 & Vite 8 | Responsive, modern ve dinamik tek sayfa uygulama (SPA). Vanilla CSS ile stil yönetimi. |
| **API İletişimi** | Fetch API & Vite Proxy | Frontend-backend arası güvenli iletişim; geliştirmede `/api` proxy desteği. |
| **Kod Kalitesi** | ESLint & Prettier | Tutarlı kod stili, otomatik formatlama ve statik analiz. |

---

## 📁 Proje Klasör Yapısı

```
Futbol-Karar-Destek-Sistemi/
├── client/                        # Frontend (React + Vite)
│   ├── public/                    # Statik dosyalar
│   ├── src/
│   │   ├── components/            # React bileşenleri
│   │   │   ├── Header.jsx         # Uygulama başlık çubuğu
│   │   │   ├── PositionForm.jsx   # Pozisyon giriş formu
│   │   │   ├── ResultCard.jsx     # AI analiz sonuç kartı
│   │   │   ├── LoadingSpinner.jsx # Yüklenme animasyonu
│   │   │   ├── History.jsx        # Analiz geçmişi listesi
│   │   │   └── Stats.jsx          # İstatistik grafikleri
│   │   ├── App.jsx                # Ana bileşen (state & routing)
│   │   ├── App.css                # Bileşen stilleri
│   │   ├── index.css              # Global stiller
│   │   └── main.jsx               # React giriş noktası
│   ├── index.html                 # HTML şablonu
│   ├── vite.config.js             # Vite yapılandırması (proxy dahil)
│   └── package.json               # Frontend bağımlılıkları
│
├── server/                        # Backend (Express.js)
│   ├── controllers/
│   │   └── analysisController.js  # HTTP istek işleyicisi (Controller)
│   ├── services/
│   │   ├── aiService.js           # Gemini AI entegrasyonu (Service)
│   │   └── dbService.js           # Veritabanı CRUD işlemleri (Service)
│   ├── models/
│   │   └── database.js            # SQLite bağlantısı ve şema (Model)
│   ├── routes/
│   │   └── analysisRoutes.js      # API endpoint tanımları (Router)
│   ├── utils/
│   │   └── validators.js          # Girdi doğrulama yardımcıları
│   ├── data/                      # SQLite veritabanı dosyası (gitignore'da)
│   ├── app.js                     # Express ana sunucu (entry point)
│   ├── .env.example               # Ortam değişkenleri şablonu
│   └── package.json               # Backend bağımlılıkları
│
├── .eslintrc.json                 # ESLint yapılandırması
├── .prettierrc                    # Prettier yapılandırması
├── .gitignore                     # Git dışlama kuralları
├── LICENSE                        # MIT Lisansı
└── README.md                      # Bu dosya
```

---

## 🔌 API Endpoint'leri

| Metot | Endpoint | Açıklama |
|---|---|---|
| `POST` | `/api/analysis/analyze` | Pozisyon metnini AI'ya gönderir, karar + kural döndürür |
| `GET` | `/api/analysis/history` | Son 20 analiz kaydını getirir |
| `GET` | `/api/analysis/stats` | Karar türlerine göre istatistik döndürür |
| `GET` | `/api/health` | Sunucu sağlık kontrolü |

### Örnek İstek & Yanıt

**İstek:**
```json
POST /api/analysis/analyze
{
  "position": "Ceza sahası içinde savunma oyuncusu rakibini arkadan iterek düşürdü."
}
```

**Yanıt:**
```json
{
  "id": 1,
  "position": "Ceza sahası içinde savunma oyuncusu rakibini arkadan iterek düşürdü.",
  "karar": "Penaltı",
  "kural_maddesi": "IFAB Kural 12: Faul ve Nezaketsizce Davranış",
  "aciklama": "Savunma oyuncusu, ceza sahası içinde rakip oyuncuyu arkadan iterek düşürmüştür. Bu eylem dikkatsiz bir müdahale olup, ceza sahası içinde gerçekleştiği için penaltı ile cezalandırılmalıdır.",
  "belirsizlik_yuzdesi": 10
}
```

---

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler

| Araç | Minimum Sürüm | İndirme |
|---|---|---|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Node.js ile birlikte gelir |
| **Git** | v2+ | [git-scm.com](https://git-scm.com/) |
| **Gemini API Key** | — | [aistudio.google.com](https://aistudio.google.com/) |

### 1. Projeyi Klonlama

```bash
git clone https://github.com/kullanici-adi/Futbol-Karar-Destek-Sistemi.git
cd Futbol-Karar-Destek-Sistemi
```

### 2. Backend Kurulumu

```bash
# Server klasörüne git ve bağımlılıkları yükle
cd server
npm install

# .env dosyasını oluştur
copy .env.example .env
```

`.env` dosyasını düzenleyerek Gemini API anahtarını ekleyin:

```env
# Google Gemini API Anahtarı (https://aistudio.google.com adresinden alınır)
GEMINI_API_KEY=buraya_api_anahtarini_yaz

# Sunucu Portu (varsayılan: 5000)
PORT=5000

# Frontend URL (CORS için)
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Kurulumu

```bash
# Proje kök dizinine dön ve client klasörüne git
cd ../client
npm install
```

### 4. Uygulamayı Başlatma

**İki ayrı terminal penceresi** açın:

**Terminal 1 — Backend Sunucusu:**
```bash
cd server
npm run dev
# ✅ Sunucu http://localhost:5000 adresinde çalışıyor
# ✅ Veritabanı hazır
```

**Terminal 2 — Frontend Geliştirme Sunucusu:**
```bash
cd client
npm run dev
# ➜ Local: http://localhost:5173/
```

Tarayıcıda `http://localhost:5173` adresine giderek uygulamayı kullanabilirsiniz.

### 5. Root Bağımlılıkları (Opsiyonel)

Kod kalitesi araçları (ESLint & Prettier) için proje kök dizininde:

```bash
# Proje kök dizininde
npm install
```

---

## 🔒 Güvenlik ve Geliştirme Standartları

- **🔑 API Anahtarı Güvenliği**: Proje `.env` ortam değişkeni yapısı kullanarak API anahtarlarını kaynak koddan tamamen ayırır. `.gitignore` konfigürasyonu sayesinde kritik kimlik bilgileri asla Git deposuna gitmez.
- **🛡️ Girdi Doğrulama**: Kullanıcı girdileri hem frontend'de hem backend'de `validators.js` ile kontrol edilir (10–2000 karakter sınırı).
- **🗄️ Hafif ve Taşınabilir Yapı**: Proje SQLite kullandığı için harici bir veritabanı sunucusu kurulumu gerektirmez; klonlandığı andan itibaren `npm install` ve `.env` düzenlemesi ile saniyeler içinde ayağa kalkabilir.
- **🔄 CORS Koruması**: Backend yalnızca belirli bir frontend URL'sinden (`CLIENT_URL`) gelen isteklere izin verir.
- **⚡ Rate Limit Yönetimi**: Gemini API ücretsiz kota aşıldığında kullanıcıya anlaşılır hata mesajı gösterilir (429 hatası).

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
