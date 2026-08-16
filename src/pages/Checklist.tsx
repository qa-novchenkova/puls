import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Task = { id: number; text: string; min: number }
type Group = { title: string; tasks: Task[] }

// min — оценка в минутах в неделю на ручное выполнение
const groups: Group[] = [
  {
    title: 'Заявки и продажи',
    tasks: [
      { id: 1, text: 'Вручную отвечаю на новые заявки', min: 90 },
      { id: 2, text: 'Переношу заявки с сайта и почты в таблицу или CRM', min: 60 },
      { id: 3, text: 'Сам напоминаю себе перезвонить клиентам', min: 40 },
      { id: 4, text: 'Разбираюсь, из какого канала пришёл клиент', min: 30 },
    ],
  },
  {
    title: 'Документы',
    tasks: [
      { id: 5, text: 'Составляю счета вручную по шаблону', min: 50 },
      { id: 6, text: 'Готовлю акты и договоры', min: 60 },
      { id: 7, text: 'Отправляю документы клиентам по одному', min: 30 },
    ],
  },
  {
    title: 'Коммуникации',
    tasks: [
      { id: 8, text: 'Пишу однотипные ответы на частые вопросы', min: 70 },
      { id: 9, text: 'Рассылаю сообщения и акции вручную', min: 45 },
      { id: 10, text: 'Напоминаю о себе и поздравляю клиентов', min: 25 },
      { id: 11, text: 'Собираю обратную связь после сделки', min: 20 },
    ],
  },
  {
    title: 'Задачи и команда',
    tasks: [
      { id: 12, text: 'Ставлю задачи сотрудникам вручную', min: 40 },
      { id: 13, text: 'Проверяю, кто что успел сделать', min: 35 },
      { id: 14, text: 'Дублирую информацию между сервисами', min: 30 },
    ],
  },
  {
    title: 'Отчёты',
    tasks: [
      { id: 15, text: 'Свожу цифры из разных таблиц', min: 60 },
      { id: 16, text: 'Считаю выручку и конверсию руками', min: 40 },
      { id: 17, text: 'Готовлю отчёты для себя или руководства', min: 45 },
    ],
  },
]

const TOTAL = groups.reduce((n, g) => n + g.tasks.length, 0)

function verdict(count: number) {
  if (count === 0) return { t: 'Похоже, у тебя уже всё под контролем', c: 'var(--color-mint)' }
  if (count <= 5) return { t: 'Есть что разгрузить — но ты держишься', c: 'var(--color-mint)' }
  if (count <= 11) return { t: 'Рутина заметно съедает твою неделю', c: '#E8A400' }
  return { t: 'Ты работаешь за робота — пора делегировать', c: 'var(--color-accent)' }
}

export default function Checklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  const toggle = (id: number) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const { count, minutes } = useMemo(() => {
    let c = 0
    let m = 0
    for (const g of groups)
      for (const t of g.tasks)
        if (checked.has(t.id)) {
          c++
          m += t.min
        }
    return { count: c, minutes: m }
  }, [checked])

  const hours = (minutes / 60).toFixed(1)
  const daysYear = Math.round((minutes * 52) / 60 / 8)
  const v = verdict(count)

  const toSignup = () => {
    navigate('/')
    setTimeout(() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <main className="mx-auto max-w-[820px] px-6 py-12 pb-[220px]">
      <div className="max-w-[52ch]">
        <span className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-mint">
          Бесплатный чек-лист
        </span>
        <h1 className="mt-3 font-display text-[clamp(2rem,4.4vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
          17 задач, которые пора<br className="hidden sm:block" /> отдать роботу
        </h1>
        <p className="mt-4 text-[1.08rem] text-ink-soft">
          Отметь всё, что до сих пор делаешь руками. Внизу посчитаем, сколько времени это стоит
          тебе каждую неделю — и во что превращается за год.
        </p>
      </div>

      <div className="mt-9 flex flex-col gap-8">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="mb-3 font-mono text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
              {g.title}
            </h2>
            <div className="flex flex-col gap-2.5">
              {g.tasks.map((t) => {
                const on = checked.has(t.id)
                return (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3.5 transition-colors ${
                      on ? 'border-accent bg-[color-mix(in_srgb,var(--color-accent)_7%,var(--color-surface))]' : 'border-line bg-surface hover:border-line-strong'
                    }`}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(t.id)} className="peer sr-only" />
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                        on ? 'border-accent bg-accent text-white' : 'border-line-strong text-transparent'
                      }`}
                      aria-hidden="true"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span className={`flex-1 text-[1rem] ${on ? '' : 'text-ink'}`}>{t.text}</span>
                    <span className="shrink-0 font-mono text-[0.78rem] text-ink-mute tabular-nums">~{t.min} мин/нед</span>
                  </label>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* липкая сводка */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[820px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[1.9rem] font-extrabold tabular-nums" style={{ color: v.c }}>
                {hours} ч
              </span>
              <span className="text-[0.9rem] text-ink-soft">в неделю на рутине</span>
            </div>
            <div className="mt-0.5 text-[0.82rem] text-ink-mute">
              {count} из {TOTAL} задач · это ≈ <b className="text-ink-soft">{daysYear} рабочих дней в год</b>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[22ch] text-right text-[0.9rem] font-medium sm:block" style={{ color: v.c }}>
              {v.t}
            </span>
            <button
              onClick={toSignup}
              className="rounded-xl bg-accent-bg px-[1.3em] py-[0.8em] font-semibold text-white transition-colors hover:bg-accent-bg-hov"
            >
              Отдать роботу →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
