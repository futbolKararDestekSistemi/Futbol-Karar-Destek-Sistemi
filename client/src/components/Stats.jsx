/**
 * Stats Bileşeni
 * Karar türlerine göre istatistikleri kartlar ve bar chart ile gösterir.
 *
 * @param {Object} props
 * @param {Array} props.stats - [{decision, count}] formatında istatistik verisi
 */
function Stats({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="stats">
        <div className="stats__empty">
          <span className="stats__empty-icon">📊</span>
          <p>Henüz yeterli veri yok</p>
        </div>
      </div>
    )
  }

  // Toplam analiz sayısı
  const total = stats.reduce((sum, s) => sum + s.count, 0)

  // En yüksek count (bar genişliği hesabı için)
  const maxCount = Math.max(...stats.map((s) => s.count))

  return (
    <div className="stats">
      {/* Üst: Özet kartları */}
      <div className="stats__grid">
        <div className="stats__card">
          <div className="stats__card-count">{total}</div>
          <div className="stats__card-label">Toplam Analiz</div>
        </div>
        <div className="stats__card">
          <div className="stats__card-count">{stats.length}</div>
          <div className="stats__card-label">Farklı Karar Türü</div>
        </div>
        {stats[0] && (
          <div className="stats__card">
            <div className="stats__card-count">{stats[0].decision}</div>
            <div className="stats__card-label">En Sık Karar</div>
          </div>
        )}
      </div>

      {/* Alt: Yatay bar chart */}
      <div className="stats__chart">
        <div className="stats__chart-title">📊 Karar Dağılımı</div>
        {stats.map((stat) => (
          <div key={stat.decision} className="stats__bar-row">
            <span className="stats__bar-label">{stat.decision}</span>
            <div className="stats__bar-track">
              <div
                className="stats__bar-fill"
                style={{ width: `${(stat.count / maxCount) * 100}%` }}
              >
                <span className="stats__bar-value">{stat.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
