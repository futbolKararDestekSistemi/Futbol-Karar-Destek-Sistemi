import { useState, useEffect, useCallback } from 'react'
import './App.css'

import Header from './components/Header'
import PositionForm from './components/PositionForm'
import ResultCard from './components/ResultCard'
import LoadingSpinner from './components/LoadingSpinner'
import History from './components/History'
import Stats from './components/Stats'

/**
 * App — Ana Bileşen
 *
 * Uygulamanın state yönetimi, API iletişimi ve
 * bileşen düzeni bu dosyada merkezi olarak yönetilir.
 *
 * Tab Yapısı:
 *  - Analiz: Pozisyon giriş formu + AI sonucu
 *  - Geçmiş: Önceki analizlerin listesi
 *  - İstatistik: Karar dağılımı grafiği
 */

const API_BASE = '/api/analysis'

function App() {
  // ─── State ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('analyze')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const [history, setHistory] = useState([])
  const [stats, setStats] = useState([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [statsLoaded, setStatsLoaded] = useState(false)

  // ─── API Fonksiyonları ─────────────────────────────────────

  /**
   * Pozisyonu AI'ya gönderir ve sonucu alır.
   */
  const handleAnalyze = async (positionText) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: positionText }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Bilinmeyen bir hata oluştu.')
      }

      setResult(data)

      // Geçmiş ve istatistikleri güncelle (yeni analiz eklendi)
      setHistoryLoaded(false)
      setStatsLoaded(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Analiz geçmişini backend'den çeker.
   */
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/history`)
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch {
      // Sessizce hata yut — geçmiş yüklenemezse kritik değil
    } finally {
      setHistoryLoaded(true)
    }
  }, [])

  /**
   * İstatistikleri backend'den çeker.
   */
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // Sessizce hata yut
    } finally {
      setStatsLoaded(true)
    }
  }, [])

  // ─── Tab Değişiminde Veri Yükleme ─────────────────────────

  useEffect(() => {
    if (activeTab === 'history' && !historyLoaded) {
      fetchHistory()
    }
    if (activeTab === 'stats' && !statsLoaded) {
      fetchStats()
    }
  }, [activeTab, historyLoaded, statsLoaded, fetchHistory, fetchStats])

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="app">
      <Header />

      {/* Tab Navigasyonu */}
      <nav className="tabs" role="tablist">
        <button
          className={`tabs__btn ${activeTab === 'analyze' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('analyze')}
          role="tab"
          aria-selected={activeTab === 'analyze'}
        >
          🔍 Analiz
        </button>
        <button
          className={`tabs__btn ${activeTab === 'history' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('history')}
          role="tab"
          aria-selected={activeTab === 'history'}
        >
          📋 Geçmiş
        </button>
        <button
          className={`tabs__btn ${activeTab === 'stats' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('stats')}
          role="tab"
          aria-selected={activeTab === 'stats'}
        >
          📊 İstatistik
        </button>
      </nav>

      {/* Tab İçerikleri */}
      {activeTab === 'analyze' && (
        <>
          <PositionForm onSubmit={handleAnalyze} loading={loading} />

          {error && (
            <div className="error" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {loading && <LoadingSpinner />}

          {result && !loading && <ResultCard result={result} />}
        </>
      )}

      {activeTab === 'history' && <History history={history} />}

      {activeTab === 'stats' && <Stats stats={stats} />}

      {/* Footer */}
      <footer className="footer">
        <p>
          Futbol Karar Destek Sistemi &copy; {new Date().getFullYear()} —
          Powered by <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Gemini AI</a>
        </p>
      </footer>
    </div>
  )
}

export default App
