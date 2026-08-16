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

  // внутристраничная прокрутка (работает и когда мы на другой странице)
  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 70)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const link = 'text-[0.94rem] font-medium text-ink-soft transition-colors hover:text-ink cursor-pointer'

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-[1.18rem] font-extrabold tracking-[-0.03em]">
          <PulseLogo />
          Пульс
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <button className={link} onClick={() => scrollTo('pain')}>Проблема</button>
          <button className={link} onClick={() => scrollTo('how')}>Как работает</button>
          <button className={link} onClick={() => scrollTo('features')}>Возможности</button>
          <Link className={link} to="/glossary">Глоссарий</Link>

          <button
            onClick={toggle}
            aria-label="Переключить тему"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line-strong text-ink-soft transition-colors hover:text-ink"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          <button
            onClick={() => scrollTo('signup')}
            className="rounded-xl bg-accent-bg px-[1.1em] py-[0.6em] text-[0.94rem] font-semibold text-white transition-colors hover:bg-accent-bg-hov"
          >
            Оставить заявку
          </button>
        </div>

        {/* мобильный: тема + CTA */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggle}
            aria-label="Переключить тему"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line-strong text-ink-soft"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button
            onClick={() => scrollTo('signup')}
            className="rounded-xl bg-accent-bg px-[1em] py-[0.55em] text-[0.9rem] font-semibold text-white"
          >
            Заявка
          </button>
        </div>
      </div>
    </nav>
  )
}
