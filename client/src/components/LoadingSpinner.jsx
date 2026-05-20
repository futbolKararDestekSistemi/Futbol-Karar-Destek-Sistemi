/**
 * LoadingSpinner Bileşeni
 * AI yanıtı beklenirken gösterilen yükleme animasyonu.
 */
function LoadingSpinner() {
  return (
    <div className="spinner">
      <div className="spinner__ring"></div>
      <p className="spinner__text">Yapay zeka pozisyonu analiz ediyor…</p>
      <p className="spinner__subtext">Bu işlem birkaç saniye sürebilir</p>
    </div>
  )
}

export default LoadingSpinner
