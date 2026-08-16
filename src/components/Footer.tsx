import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-[76px] border-t border-line py-12">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5 px-6 text-[0.88rem] text-ink-mute">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span>© 2026 Пульс — демо-проект портфолио. Бренд вымышленный.</span>
          <Link to="/glossary" className="underline decoration-line-strong underline-offset-4 hover:text-ink">
            Глоссарий
          </Link>
        </div>
        <div className="rounded-full border border-line px-[0.9em] py-[0.3em] font-mono text-[0.72rem]">
          vibe-coded · React + Vite + Tailwind
        </div>
      </div>
    </footer>
  )
}
