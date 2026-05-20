/**
 * Header Bileşeni
 * Uygulamanın üst kısmında logo ve başlık gösterir.
 */
function Header() {
  return (
    <header className="header">
      <span className="header__icon" role="img" aria-label="Futbol">⚽</span>
      <h1 className="header__title">Futbol Karar Destek Sistemi</h1>
      <p className="header__subtitle">
        Yapay zeka destekli VAR hakem analizi — IFAB kurallarına göre
      </p>
    </header>
  )
}

export default Header
