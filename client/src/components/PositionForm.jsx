import { useState } from 'react'

/**
 * PositionForm Bileşeni
 * Kullanıcının futbol pozisyonunu yazıp analiz etmesini sağlar.
 *
 * @param {Object} props
 * @param {function} props.onSubmit - Form gönderildiğinde çağrılan fonksiyon
 * @param {boolean} props.loading - API isteği devam ediyorsa true
 */
function PositionForm({ onSubmit, loading }) {
  const [position, setPosition] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (position.trim().length >= 10 && !loading) {
      onSubmit(position.trim())
    }
  }

  const charCount = position.trim().length
  const isValid = charCount >= 10 && charCount <= 2000

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__card">
        <label className="form__label" htmlFor="position-input">
          📋 Pozisyonu Açıklayın
        </label>
        <textarea
          id="position-input"
          className="form__textarea"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Örnek: Ceza sahası içinde savunma oyuncusu, rakip forvete arkadan kayarak müdahale etti ve topa değmeden oyuncuyu düşürdü…"
          disabled={loading}
          maxLength={2000}
        />
        <div className="form__footer">
          <span className="form__char-count">
            {charCount} / 2000 karakter {charCount > 0 && charCount < 10 && '(en az 10)'}
          </span>
          <button
            type="submit"
            className="form__submit"
            disabled={!isValid || loading}
          >
            {loading ? '⏳ Analiz Ediliyor…' : '🔍 Analiz Et'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default PositionForm
