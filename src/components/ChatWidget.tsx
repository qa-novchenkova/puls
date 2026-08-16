import { useEffect, useRef, useState } from 'react'

type Msg =
  | { from: 'bot'; text: string; source?: string }
  | { from: 'user'; text: string }
  | { from: 'action'; text: string; done?: boolean }

type Intent = {
  keys: RegExp
  reply: string
  source?: string
  chips?: string[]
  action?: boolean
  escalate?: boolean
}

// «База знаний», по которой отвечает ассистент (упрощённый RAG-сценарий).
// Порядок важен: более точные интенты идут раньше — совпадает первый подходящий.
const intents: Intent[] = [
  {
    keys: /(привет|здравств|добрый (день|вечер|утро)|доброе утро|хай|hello|\bhi\b)/i,
    reply: 'Привет! Рад помочь 🙂 Спросите про Пульс или выберите тему:',
    chips: ['Что умеет Пульс?', 'Сколько стоит?', 'Оставить заявку'],
  },
  {
    keys: /(спасибо|благодар|\bспс\b|thanks|thank you|понятно|ясно)/i,
    reply: 'Пожалуйста! Если появятся вопросы — я на связи 🙌',
    chips: ['Что умеет Пульс?', 'Сколько стоит?', 'Оставить заявку'],
  },
  {
    keys: /(демо|ты бот|это бот|ты робот|настоящ|живой ли|ты человек|ты (ии|искусственн)|нейросет|кто ты|как ты работаешь|версия|ненастоящ)/i,
    reply:
      'Я — демо-ассистент этого портфолио-проекта. Отвечаю по заранее заданной базе знаний Пульса и показываю, как ИИ-агент выполняет действия. В боевой версии на моём месте работала бы полноценная языковая модель, отвечающая свободно на любой вопрос.',
    chips: ['Что умеет Пульс?', 'Оставить заявку', 'Позвать человека'],
  },
  {
    keys: /(умеет|возможност|функци|что может|что делает|для чего)/i,
    reply:
      'Пульс автоматизирует рутину малого бизнеса: собирает заявки со всех каналов, ведёт сделки в CRM, выставляет счета и документы, шлёт напоминания и follow-up, делает отчёты в реальном времени и запускает рассылки.',
    source: 'Возможности',
    chips: ['Сколько стоит?', 'А это безопасно?', 'Оставить заявку'],
  },
  {
    keys: /(цен|стоит|тариф|сколько|деньг|платн|бесплатн|оплат)/i,
    reply:
      'Старт — бесплатный, без карты. Платные тарифы подключаются, когда бизнес растёт, и считаются по числу сценариев и пользователей. Точную смету менеджер соберёт под ваши задачи.',
    source: 'Тарифы',
    chips: ['Что входит в бесплатный?', 'Оставить заявку', 'Позвать человека'],
  },
  {
    keys: /(безопас|данны|защит|персональн|утеч|конфиденц|on-?prem)/i,
    reply:
      'Данные изолированы и шифруются. Для чувствительных сфер есть вариант on-premise — система разворачивается на ваших серверах, и данные не покидают контур компании.',
    source: 'Безопасность',
    chips: ['Какие интеграции есть?', 'Оставить заявку'],
  },
  {
    keys: /(интеграц|crm|битрикс|amocrm|api|подключа|телеграм|whatsapp|почт)/i,
    reply:
      'Подключаемся к сайту, мессенджерам (Telegram, WhatsApp), почте и телефонии, синхронизируемся с популярными CRM и работаем через API. Заявки из всех каналов падают в одну ленту.',
    source: 'Интеграции',
    chips: ['Сколько стоит?', 'Оставить заявку'],
  },
  {
    keys: /(входит|включ).*(бесплат|тариф)|бесплат.*(входит|включ|что)/i,
    reply:
      'В бесплатном тарифе: одна воронка, до 3 сценариев автоматизации, приём заявок с сайта и одного мессенджера, базовые отчёты. Этого хватает, чтобы почувствовать эффект.',
    source: 'Тарифы',
    chips: ['Оставить заявку', 'Позвать человека'],
  },
  {
    keys: /(оставить заявк|оформ|подключить|попробовать|зарегистр|начать работу|как начать|записаться|оставить контакт|хочу подключ|давайте начн)/i,
    reply: 'Секунду, оформляю заявку — покажу, как это делает ИИ-агент 👇',
    action: true,
  },
  {
    keys: /(человек|оператор|менеджер|позвони|связаться|живой|специалист)/i,
    reply: '',
    escalate: true,
  },
]

const greeting: Msg = {
  from: 'bot',
  text: 'Привет! Я ИИ-ассистент Пульса 🤖 Помогу разобраться с автоматизацией. Спросите что угодно или выберите тему:',
}
const startChips = ['Что умеет Пульс?', 'Сколько стоит?', 'А это безопасно?', 'Оставить заявку']

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([greeting])
  const [chips, setChips] = useState<string[]>(startChips)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [busy, setBusy] = useState(false)
  const failsRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

  const push = (m: Msg) => setMsgs((prev) => [...prev, m])

  const botSay = async (text: string, source?: string, ms = 650) => {
    setTyping(true)
    await delay(ms)
    setTyping(false)
    push({ from: 'bot', text, source })
  }

  // цепочка действий ИИ-агента (демонстрация «агент делает, а не только отвечает»)
  const runAgent = async () => {
    const steps = [
      'Проверяю свободных менеджеров…',
      'Создаю сделку в CRM…',
      'Ставлю задачу перезвонить клиенту…',
    ]
    for (const s of steps) {
      push({ from: 'action', text: s })
      await delay(700)
      setMsgs((prev) => {
        const copy = [...prev]
        for (let i = copy.length - 1; i >= 0; i--) {
          const item = copy[i]
          if (item.from === 'action' && item.text === s) {
            copy[i] = { from: 'action', text: s, done: true }
            break
          }
        }
        return copy
      })
    }
    await botSay(
      'Готово! Сделка №1042 создана, менеджер Анна получила задачу перезвонить в течение 15 минут. Что-то ещё?',
      'CRM · Сценарий «Новая заявка»',
      400,
    )
    setChips(['Что умеет Пульс?', 'Сколько стоит?', 'Спасибо!'])
  }

  const escalate = async () => {
    await botSay(
      'Конечно, подключаю живого специалиста. Оставьте, пожалуйста, имя и телефон в форме на странице — и наш менеджер свяжется с вами. Я уже передал ему контекст нашего диалога.',
      'Эскалация на оператора',
    )
    setChips(['Вернуться к вопросам'])
  }

  const respond = async (text: string) => {
    setBusy(true)
    const hit = intents.find((i) => i.keys.test(text))
    if (hit?.action) {
      await botSay(hit.reply, undefined, 500)
      await runAgent()
    } else if (hit?.escalate) {
      await escalate()
    } else if (hit) {
      failsRef.current = 0
      await botSay(hit.reply, hit.source)
      if (hit.chips) setChips(hit.chips)
    } else {
      failsRef.current += 1
      if (failsRef.current >= 2) {
        await botSay(
          'Кажется, я не до конца понял вопрос. Давайте я подключу живого специалиста — так будет быстрее.',
          'Эскалация на оператора',
        )
        setChips(['Позвать человека', 'Что умеет Пульс?'])
      } else {
        await botSay(
          'Пока умею отвечать про возможности, тарифы, безопасность и интеграции — или могу оформить заявку. Что из этого ближе?',
        )
        setChips(startChips)
      }
    }
    setBusy(false)
  }

  const send = (text: string) => {
    const t = text.trim()
    if (!t || busy) return
    push({ from: 'user', text: t })
    setChips([])
    setInput('')
    void respond(t)
  }

  return (
    <>
      {/* Плавающая кнопка */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Закрыть чат' : 'Открыть чат с ассистентом'}
        className="fixed bottom-6 right-6 z-[80] grid h-14 w-14 place-items-center rounded-full bg-accent-bg text-white shadow-[0_12px_30px_-6px_rgba(214,43,58,0.5)] transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M8 9.5h8M8 12.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        )}
      </button>

      {/* Панель чата */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[80] flex h-[70vh] max-h-[560px] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)]">
          {/* header */}
          <div className="flex items-center gap-3 border-b border-line bg-panel px-4 py-3 text-panel-ink">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-bg text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12h4l2-6 3.5 12L15 8l2 4h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <div className="flex-1">
              <div className="text-[0.95rem] font-bold leading-tight">Пульс · ИИ-ассистент</div>
              <div className="flex items-center gap-1.5 text-[0.72rem] text-panel-soft">
                <span className="beat h-1.5 w-1.5 rounded-full bg-mint" /> на связи
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Закрыть чат"
              className="grid h-8 w-8 place-items-center rounded-lg text-panel-soft transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-panel-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => {
              if (m.from === 'action') {
                return (
                  <div key={i} className="flex items-center gap-2 self-start font-mono text-[0.75rem] text-ink-soft">
                    <span className={m.done ? 'text-mint' : 'text-accent'}>{m.done ? '✓' : '⚙'}</span>
                    {m.text}
                  </div>
                )
              }
              const isUser = m.from === 'user'
              return (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.9rem] leading-snug ${
                    isUser
                      ? 'self-end rounded-br-sm bg-accent-bg text-white'
                      : 'self-start rounded-bl-sm border border-line bg-bg text-ink'
                  }`}
                >
                  {m.text}
                  {m.from === 'bot' && m.source && (
                    <div className="mt-1.5 flex items-center gap-1 font-mono text-[0.62rem] text-ink-mute">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 3h9l3 3v15H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                      база знаний · {m.source}
                    </div>
                  )}
                </div>
              )
            })}
            {typing && (
              <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-line bg-bg px-3.5 py-3">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            )}
          </div>

          {/* quick replies */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => (c === 'Вернуться к вопросам' ? (setChips(startChips)) : send(c))}
                  className="rounded-full border border-line-strong px-3 py-1.5 text-[0.8rem] text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите сообщение…"
              className="flex-1 rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[0.9rem] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Отправить"
              disabled={busy}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-bg text-white transition-colors hover:bg-accent-bg-hov disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 8 6 8-16-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
