import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/useTheme'

export function PulseLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12h4l2-6 3.5 12L15 8l2 4h5"
        stroke="var(--color-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Nav() {
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menu, setMenu] = useState(false)

  // внутристраничная прокрутка (работает и когда мы на другой странице)
  const scrollTo = (id: string) => {
    setMenu(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 70)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const link = 'text-[0.94rem] font-medium text-ink-soft transition-colors hover:text-ink cursor-pointer'

  const ThemeBtn = ({ className = '' }: { className?: string }) => (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      className={`grid h-9 w-9 place-items-center rounded-lg border border-line-strong text-ink-soft transition-colors hover:text-ink ${className}`}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1280px] items-center justify-between px-6">
        <Link
          to="/"
          onClick={() => setMenu(false)}
          className="flex items-center gap-2 font-display text-[1.18rem] font-extrabold tracking-[-0.03em]"
        >
          <PulseLogo />
          Пульс
        </Link>

        {/* десктоп */}
        <div className="hidden items-center gap-7 md:flex">
          <button className={link} onClick={() => scrollTo('pain')}>Проблема</button>
          <button className={link} onClick={() => scrollTo('how')}>Как работает</button>
          <button className={link} onClick={() => scrollTo('features')}>Возможности</button>
          <Link className={link} to="/glossary">Глоссарий</Link>
          <Link className={link} to="/quiz">Тест</Link>
          <ThemeBtn />
          <button
            onClick={() => scrollTo('signup')}
            className="rounded-xl bg-accent-bg px-[1.1em] py-[0.6em] text-[0.94rem] font-semibold text-white transition-colors hover:bg-accent-bg-hov"
          >
            Оставить заявку
          </button>
        </div>

        {/* мобайл: тема + гамбургер */}
        <div className="flex items-center gap-2.5 md:hidden">
          <ThemeBtn />
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menu}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line-strong text-ink"
          >
            {menu ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* мобильное выпадающее меню */}
      {menu && (
        <div className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-4">
            <button className="py-2.5 text-left text-[1rem] font-medium text-ink-soft" onClick={() => scrollTo('pain')}>Проблема</button>
            <button className="py-2.5 text-left text-[1rem] font-medium text-ink-soft" onClick={() => scrollTo('how')}>Как работает</button>
            <button className="py-2.5 text-left text-[1rem] font-medium text-ink-soft" onClick={() => scrollTo('features')}>Возможности</button>
            <Link className="py-2.5 text-left text-[1rem] font-medium text-ink-soft" to="/glossary" onClick={() => setMenu(false)}>Глоссарий</Link>
            <Link className="py-2.5 text-left text-[1rem] font-medium text-ink-soft" to="/quiz" onClick={() => setMenu(false)}>Тест</Link>
            <button
              onClick={() => scrollTo('signup')}
              className="mt-2 rounded-xl bg-accent-bg px-[1.1em] py-[0.75em] text-center text-[0.96rem] font-semibold text-white"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
