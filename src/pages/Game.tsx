import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type Lead = { id: number; x: number; y: number; born: number; ttl: number; kind: number }
type Status = 'idle' | 'play' | 'over'

const START_LIVES = 3
const KINDS = [
  { label: 'Сайт', d: 'M4 4h16v12H7l-3 3V4z' },
  { label: 'Мессенджер', d: 'M4 12l16-8-6 8 6 8-16-8z' },
  { label: 'Звонок', d: 'M5 4h4l1 5-2 1a12 12 0 006 6l1-2 5 1v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z' },
  { label: 'Почта', d: 'M3 5h18v14H3zM3 7l9 6 9-6' },
]

export default function Game() {
  const [status, setStatus] = useState<Status>('idle')
  const [snap, setSnap] = useState({ leads: [] as Lead[], score: 0, lives: START_LIVES, now: 0 })
  const [best, setBest] = useState(() => Number(localStorage.getItem('puls-game-best') || 0))

  const g = useRef({ leads: [] as Lead[], score: 0, lives: START_LIVES, elapsed: 0, spawnAcc: 0, last: 0, seq: 0 })

  const start = () => {
    g.current = { leads: [], score: 0, lives: START_LIVES, elapsed: 0, spawnAcc: 0, last: performance.now(), seq: 0 }
    setSnap({ leads: [], score: 0, lives: START_LIVES, now: performance.now() })
    setStatus('play')
  }

  useEffect(() => {
    if (status !== 'play') return
    g.current.last = performance.now()
    const iv = setInterval(() => {
      const s = g.current
      const t = performance.now()
      const dt = t - s.last
      s.last = t
      s.elapsed += dt
      s.spawnAcc += dt

      const spawnEvery = Math.max(560, 1300 - s.elapsed / 45)
      if (s.spawnAcc >= spawnEvery) {
        s.spawnAcc = 0
        const ttl = Math.max(1250, 2300 - s.elapsed / 38)
        s.leads.push({
          id: ++s.seq,
          x: 6 + Math.random() * 82,
          y: 12 + Math.random() * 72,
          born: t,
          ttl,
          kind: Math.floor(Math.random() * KINDS.length),
        })
      }

      // сгорание
      const alive: Lead[] = []
      let burned = 0
      for (const l of s.leads) {
        if (t - l.born >= l.ttl) burned++
        else alive.push(l)
      }
      s.leads = alive
      if (burned) s.lives -= burned

      setSnap({ leads: s.leads.slice(), score: s.score, lives: s.lives, now: t })

      if (s.lives <= 0) {
        clearInterval(iv)
        setBest((b) => {
          const nb = Math.max(b, s.score)
          localStorage.setItem('puls-game-best', String(nb))
          return nb
        })
        setStatus('over')
      }
    }, 33)
    return () => clearInterval(iv)
  }, [status])

  const process = (id: number) => {
    const s = g.current
    const before = s.leads.length
    s.leads = s.leads.filter((l) => l.id !== id)
    if (s.leads.length < before) {
      s.score += 1
      setSnap((p) => ({ ...p, leads: s.leads.slice(), score: s.score }))
    }
  }

  return (
    <main className="mx-auto max-w-[820px] px-6 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-[46ch]">
          <span className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
            Мини-игра
          </span>
          <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance">
            Успей обработать лиды
          </h1>
        </div>
        {status === 'play' && (
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">Счёт</div>
              <div className="font-display text-[1.7rem] font-extrabold tabular-nums">{snap.score}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">Жизни</div>
              <div className="text-[1.4rem] leading-none">
                {'❤'.repeat(Math.max(0, snap.lives))}
                <span className="opacity-25">{'❤'.repeat(START_LIVES - Math.max(0, snap.lives))}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* игровое поле */}
      <div className="relative min-h-[380px] overflow-hidden rounded-[24px] border border-line bg-panel"
        style={{ height: '58vh', maxHeight: '480px' }}>
        {/* сетка-фон */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(var(--color-panel-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-panel-ink) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* ИНТРО */}
        {status === 'idle' && (
          <div className="absolute inset-0 grid place-items-center p-8 text-center text-panel-ink">
            <div>
              <p className="mx-auto max-w-[42ch] text-[1.05rem] text-panel-soft">
                Заявки прилетают со всех каналов и <b className="text-panel-ink">сгорают</b>, если не успеть.
                Кликай по ним, пока горит таймер. Три промаха — и день провален.
              </p>
              <button onClick={start} className="mt-7 rounded-xl bg-accent-bg px-[1.6em] py-[0.9em] font-semibold text-white transition-colors hover:bg-accent-bg-hov">
                Играть →
              </button>
              {best > 0 && <div className="mt-4 font-mono text-[0.8rem] text-panel-soft">рекорд: {best}</div>}
            </div>
          </div>
        )}

        {/* ЛИДЫ */}
        {status === 'play' &&
          snap.leads.map((l) => {
            const life = Math.min(1, Math.max(0, 1 - (snap.now - l.born) / l.ttl))
            const hot = life < 0.35
            const k = KINDS[l.kind]
            return (
              <button
                key={l.id}
                onClick={() => process(l.id)}
                className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border bg-surface p-0 shadow-lg transition-transform active:scale-90"
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  width: 64,
                  height: 64,
                  borderColor: hot ? 'var(--color-accent)' : 'var(--color-line-strong)',
                }}
                aria-label={`Обработать заявку: ${k.label}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: hot ? 'var(--color-accent)' : 'var(--color-ink-soft)' }}>
                  <path d={k.d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* таймер-полоса */}
                <span className="absolute bottom-1.5 left-2 right-2 h-1 overflow-hidden rounded-full bg-line">
                  <span className="block h-full rounded-full" style={{ width: `${life * 100}%`, background: hot ? 'var(--color-accent)' : 'var(--color-mint)' }} />
                </span>
              </button>
            )
          })}

        {/* GAME OVER */}
        {status === 'over' && (
          <div className="absolute inset-0 grid place-items-center bg-[rgba(10,13,18,0.86)] p-8 text-center text-panel-ink">
            <div>
              <div className="text-[3rem] leading-none">🔥</div>
              <h2 className="mt-2 font-display text-[2rem] font-extrabold tracking-[-0.02em]">День провален</h2>
              <p className="mx-auto mt-3 max-w-[44ch] text-[1.05rem] text-panel-soft">
                Ты обработал <b className="text-accent">{snap.score}</b>{' '}
                {plural(snap.score, 'заявку', 'заявки', 'заявок')} вручную — и всё равно что-то сгорело.
                Пульс обработал бы все автоматически, без нервов и промахов.
              </p>
              <div className="mt-2 font-mono text-[0.82rem] text-panel-soft">рекорд: {Math.max(best, snap.score)}</div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button onClick={start} className="rounded-xl bg-accent-bg px-[1.5em] py-[0.85em] font-semibold text-white transition-colors hover:bg-accent-bg-hov">
                  Ещё раз
                </button>
                <Link to="/" className="rounded-xl border border-panel-line px-[1.5em] py-[0.85em] font-semibold text-panel-ink transition-colors hover:border-panel-soft">
                  Узнать про Пульс
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center font-mono text-[0.78rem] text-ink-mute">
        Совет: чем дольше играешь, тем быстрее летят заявки — прямо как в реальном отделе продаж.
      </p>
    </main>
  )
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}
