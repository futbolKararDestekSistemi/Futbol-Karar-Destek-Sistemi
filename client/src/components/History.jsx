/**
 * History Bileşeni
 * Daha önce yapılan analiz sonuçlarını listeler.
 *
 * @param {Object} props
 * @param {Array} props.history - Analiz geçmişi listesi
 */
function History({ history }) {
  // Karar türüne göre ikon
  const getIcon = (decision) => {
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
    return icons[decision] || '⚖️'
  }

  // Tarih formatlama
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!history || history.length === 0) {
    return (
      <div className="history">
        <div className="history__empty">
          <span className="history__empty-icon">📭</span>
          <p className="history__empty-text">Henüz analiz yapılmamış</p>
          <p className="history__empty-sub">
            İlk analizi yapmak için &quot;Analiz&quot; sekmesine geçin
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="history__list">
        {history.map((item) => (
          <div key={item.id} className="history__item">
            <div className="history__item-top">
              <span className="history__item-decision">
                {getIcon(item.decision)} {item.decision}
              </span>
              <span className="history__item-date">
                {formatDate(item.created_at)}
              </span>
            </div>
            <p className="history__item-position">{item.position}</p>
            {item.rule_ref && (
              <p className="history__item-rule">📖 {item.rule_ref}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default History
