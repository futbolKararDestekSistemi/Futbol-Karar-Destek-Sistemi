/**
 * ResultCard Bileşeni
 * Yapay zekadan gelen analiz sonucunu görsel olarak gösterir.
 *
 * @param {Object} props
 * @param {Object} props.result - AI'dan dönen analiz sonucu
 */
function ResultCard({ result }) {
  if (!result) return null

  // Karar türüne göre ikon seç
  const getDecisionIcon = (karar) => {
    const icons = {
      'Penaltı': '🟥',
      'Kırmızı Kart': '🟥',
      'Sarı Kart': '🟨',
      'Serbest Vuruş': '⚡',
      'Ofsayt': '🚩',
      'Gol Geçerli': '⚽',
      'Gol İptal': '❌',
      'Devam Et': '✅',
      'Taç': '📐',
      'Kale Vuruşu': '🥅',
      'Köşe Vuruşu': '🏁',
    }
    return icons[karar] || '⚖️'
  }

  // Güven yüzdesini hesapla (belirsizlik → güven)
  const confidence = 100 - (result.belirsizlik_yuzdesi || 0)

  const getConfidenceClass = (value) => {
    if (value >= 75) return 'result__confidence-fill--high'
    if (value >= 50) return 'result__confidence-fill--medium'
    return 'result__confidence-fill--low'
  }

  return (
    <div className="result">
      <div className="result__card">
        {/* Üst kısım: Karar + Güven barı */}
        <div className="result__header">
          <div className="result__decision">
            <span className="result__decision-icon">
              {getDecisionIcon(result.karar)}
            </span>
            <span className="result__decision-text">{result.karar}</span>
          </div>
          <div className="result__confidence">
            <span className="result__confidence-label">
              Güven: %{confidence}
            </span>
            <div className="result__confidence-bar">
              <div
                className={`result__confidence-fill ${getConfidenceClass(confidence)}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alt kısım: Kural + Açıklama */}
        <div className="result__body">
          {result.kural_maddesi && (
            <div className="result__section">
              <div className="result__section-title">📖 Kural Maddesi</div>
              <div className="result__rule-badge">
                {result.kural_maddesi}
              </div>
            </div>
          )}

          {result.aciklama && (
            <div className="result__section">
              <div className="result__section-title">💬 Açıklama</div>
              <p className="result__section-content">{result.aciklama}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultCard
