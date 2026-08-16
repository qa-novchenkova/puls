import { useState } from 'react'
import { Link } from 'react-router-dom'

type Kind = 'fire' | 'juggle' | 'perfect' | 'conductor'

const questions: { q: string; options: { t: string; k: Kind }[] }[] = [
  {
    q: 'Рабочее утро начинается с того, что ты…',
    options: [
      { t: 'Разгребаю 40 непрочитанных — где-то уже что-то горит', k: 'fire' },
      { t: 'Открываю сразу 8 вкладок и три чата', k: 'juggle' },
      { t: 'Допиливаю вчерашнюю задачу, которая «почти готова»', k: 'perfect' },
      { t: 'Смотрю план на день и расставляю приоритеты', k: 'conductor' },
    ],
  },
  {
    q: 'Прилетела срочная задача. Ты…',
    options: [
      { t: 'Бросаю всё и делаю немедленно', k: 'fire' },
      { t: 'Впихиваю её между тремя текущими', k: 'juggle' },
      { t: 'Сначала уточню все детали, чтобы сделать идеально', k: 'perfect' },
      { t: 'Оцениваю приоритет — в очередь или делегировать', k: 'conductor' },
    ],
  },
  {
    q: 'Твоё рабочее пространство — это…',
    options: [
      { t: 'Хаос, но я вроде знаю, где что лежит', k: 'fire' },
      { t: 'Стикеры, вкладки и вкладки поверх вкладок', k: 'juggle' },
      { t: 'Всё выверено, иконки по линеечке', k: 'perfect' },
      { t: 'Минимум лишнего, всё живёт в таск-трекере', k: 'conductor' },
    ],
  },
  {
    q: 'Коллега спрашивает статус по задаче. Ты…',
    options: [
      { t: '«Секунду… сейчас найду»', k: 'fire' },
      { t: 'Помню примерно — уточню в трёх местах', k: 'juggle' },
      { t: 'Рассказываю в деталях, даже в лишних', k: 'perfect' },
      { t: 'Кидаю ссылку на доску — там всё видно', k: 'conductor' },
    ],
  },
  {
    q: 'Что бесит на работе больше всего?',
    options: [
      { t: 'Когда всё одновременно и срочно', k: 'fire' },
      { t: 'Когда постоянно дёргают между задачами', k: 'juggle' },
      { t: 'Когда нет времени доделать как надо', k: 'perfect' },
      { t: 'Когда рутину нельзя автоматизировать', k: 'conductor' },
    ],
  },
  {
    q: 'Идеальный рабочий день — это когда…',
    options: [
      { t: 'Не случилось ни одного пожара', k: 'fire' },
      { t: 'Удавалось делать одну задачу за раз', k: 'juggle' },
      { t: 'Было время всё вылизать до блеска', k: 'perfect' },
      { t: 'Всё шло по системе — почти без меня', k: 'conductor' },
    ],
  },
]

const results: Record<Kind, { emoji: string; name: string; color: string; desc: string; tip: string }> = {
  fire: {
    emoji: '🔥',
    name: 'Пожарный',
    color: '#FF4B57',
    desc: 'Ты живёшь в режиме «горит!». Реагируешь молниеносно и спасаешь ситуацию, когда всё рушится. Но день сжирают чужие срочности, а на своё важное сил не остаётся.',
    tip: 'Тебе бы помогли автосценарии: пусть заявки и напоминания разбираются сами — а ты тушишь только настоящие пожары.',
  },
  juggle: {
    emoji: '🤹',
    name: 'Жонглёр',
    color: '#2C93FF',
    desc: 'Пять чатов, три таблицы, всё в голове. Пока держишь — выглядит как магия. Но стоит уронить один шар — и начинается лавина.',
    tip: 'Тебе бы помогла единая лента задач и заявок: меньше вкладок в голове — меньше шансов что-то уронить.',
  },
  perfect: {
    emoji: '💎',
    name: 'Перфекционист',
    color: '#7C6BFF',
    desc: 'Ты доводишь до идеала даже то, чего никто не заметит. Качество на высоте — но дедлайны иногда страдают, потому что «ещё чуть-чуть подправить».',
    tip: 'Тебе бы помогли шаблоны и автодокументы: рутина по стандарту — а твоё внимание туда, где оно правда решает.',
  },
  conductor: {
    emoji: '🎼',
    name: 'Дирижёр',
    color: '#0FA36B',
    desc: 'Ты не тушишь пожары — ты выстраиваешь систему, где их нет. Делегируешь, автоматизируешь и держишь всю картину целиком.',
    tip: 'Ты уже мыслишь автоматизацией — Пульс просто даст тебе инструменты, чтобы собрать оркестр из процессов.',
  },
}

function Bar({ step, total }: { step: number; total: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  )
}

export default function Quiz() {
  const [step, setStep] = useState(-1) // -1 интро, 0..n вопросы, n результат
  const [scores, setScores] = useState<Record<Kind, number>>({ fire: 0, juggle: 0, perfect: 0, conductor: 0 })
  const [copied, setCopied] = useState(false)

  const total = questions.length

  const pick = (k: Kind) => {
    setScores((s) => ({ ...s, [k]: s[k] + 1 }))
    setStep((st) => st + 1)
  }

  const restart = () => {
    setScores({ fire: 0, juggle: 0, perfect: 0, conductor: 0 })
    setStep(-1)
    setCopied(false)
  }

  const winner: Kind = (Object.keys(scores) as Kind[]).reduce((a, b) => (scores[b] > scores[a] ? b : a), 'fire')
  const r = results[winner]

  const shareText = `Я в хаосе рабочего дня — «${r.name}» ${r.emoji}. А ты кто? Пройди тест:`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="mx-auto max-w-[720px] px-6 py-12">
      {/* ИНТРО */}
      {step === -1 && (
        <div className="rounded-[26px] border border-panel-line bg-panel p-8 text-panel-ink sm:p-12">
          <span className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#FF6A73]">
            Тест · 6 вопросов · 1 минута
          </span>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-balance">
            Кто ты в хаосе<br />рабочего дня?
          </h1>
          <p className="mt-4 max-w-[46ch] text-[1.08rem] text-panel-soft">
            Пожарный, жонглёр, перфекционист или дирижёр? Ответь на 6 вопросов и узнай свой рабочий
            архетип — а заодно, что бы тебе разгрузило день.
          </p>
          <button
            onClick={() => setStep(0)}
            className="mt-8 rounded-xl bg-accent-bg px-[1.6em] py-[0.9em] font-semibold text-white transition-colors hover:bg-accent-bg-hov"
          >
            Начать тест →
          </button>
        </div>
      )}

      {/* ВОПРОСЫ */}
      {step >= 0 && step < total && (
        <div>
          <div className="mb-6 flex items-center gap-4">
            <Bar step={step} total={total} />
            <span className="shrink-0 font-mono text-[0.8rem] tabular-nums text-ink-mute">
              {step + 1} / {total}
            </span>
          </div>
          <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">
            {questions[step].q}
          </h2>
          <div className="mt-7 flex flex-col gap-3">
            {questions[step].options.map((o) => (
              <button
                key={o.t}
                onClick={() => pick(o.k)}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-left text-[1rem] transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_10px_30px_-12px_rgba(214,43,58,0.35)]"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line-strong text-[0.8rem] text-ink-mute transition-colors group-hover:border-accent group-hover:text-accent">
                  →
                </span>
                {o.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* РЕЗУЛЬТАТ */}
      {step >= total && (
        <div>
          <div
            className="rounded-[26px] border p-8 text-center sm:p-12"
            style={{ borderColor: `${r.color}55`, background: `color-mix(in srgb, ${r.color} 9%, var(--color-surface))` }}
          >
            <div className="text-[4.5rem] leading-none">{r.emoji}</div>
            <div className="mt-3 font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em]" style={{ color: r.color }}>
              Твой архетип
            </div>
            <h1 className="mt-2 font-display text-[clamp(2.2rem,6vw,3.4rem)] font-extrabold tracking-[-0.03em]">
              {r.name}
            </h1>
            <p className="mx-auto mt-4 max-w-[48ch] text-[1.08rem] text-ink-soft">{r.desc}</p>
            <div className="mx-auto mt-6 max-w-[48ch] rounded-2xl border border-line bg-surface px-5 py-4 text-[0.98rem]">
              <span className="font-semibold" style={{ color: r.color }}>💡 Что бы тебя разгрузило: </span>
              {r.tip}
            </div>
          </div>

          {/* шаринг */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={copy}
              className="rounded-xl border border-line-strong px-5 py-3 text-[0.95rem] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {copied ? '✓ Скопировано' : '🔗 Скопировать ссылку'}
            </button>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#2C93FF] px-5 py-3 text-[0.95rem] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Telegram
            </a>
            <a
              href={`https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#0077FF] px-5 py-3 text-[0.95rem] font-semibold text-white transition-opacity hover:opacity-90"
            >
              ВКонтакте
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[0.95rem]">
            <button onClick={restart} className="font-medium text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink">
              Пройти заново
            </button>
            <span className="text-ink-mute">·</span>
            <Link to="/" className="font-medium text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink">
              Узнать про Пульс
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
