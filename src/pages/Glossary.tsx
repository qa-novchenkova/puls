import { useMemo, useState } from 'react'

type Cat = 'Продажи' | 'Автоматизация' | 'ИИ' | 'Данные'

const cats: Cat[] = ['Продажи', 'Автоматизация', 'ИИ', 'Данные']

const terms: { term: string; cat: Cat; def: string }[] = [
  { term: 'Лид', cat: 'Продажи', def: 'Потенциальный клиент, который проявил интерес — оставил заявку, написал, позвонил. Ещё не покупатель, но уже «тёплый».' },
  { term: 'Заявка', cat: 'Продажи', def: 'Обращение клиента с любого канала (сайт, мессенджер, звонок). В Пульсе все заявки собираются в одну ленту.' },
  { term: 'Воронка продаж', cat: 'Продажи', def: 'Путь клиента от первого интереса до оплаты, разбитый на этапы. Видно, на каком шаге клиенты уходят и почему.' },
  { term: 'Конверсия', cat: 'Продажи', def: 'Доля тех, кто дошёл до нужного шага. Например, из 100 заявок купили 12 — конверсия 12%.' },
  { term: 'Follow-up', cat: 'Продажи', def: 'Повторное обращение к клиенту, который пока не ответил: вежливо напомнить о себе и помочь с выбором. Часто именно оно и приводит к сделке.' },
  { term: 'Лид-магнит', cat: 'Продажи', def: 'Бесплатная польза (чек-лист, гайд, шаблон, тест) в обмен на контакт. Помогает превратить анонимного посетителя в лида, с которым уже можно работать.' },
  { term: 'Питч-дек', cat: 'Продажи', def: 'Короткая презентация, которая ёмко объясняет продукт: проблему, решение, выгоды и следующий шаг. Обычно 8–12 слайдов.' },

  { term: 'Автоматизация', cat: 'Автоматизация', def: 'Когда рутинные действия делает система, а не человек: ответить, создать документ, поставить задачу, напомнить.' },
  { term: 'Сценарий', cat: 'Автоматизация', def: 'Заранее описанная цепочка «если… то…». Например: пришла заявка → ответить → создать сделку → напомнить менеджеру.' },
  { term: 'Триггер', cat: 'Автоматизация', def: 'Событие, которое запускает сценарий. Например, «клиент оставил заявку» или «прошло 2 дня без ответа».' },
  { term: 'Интеграция', cat: 'Автоматизация', def: 'Связь двух сервисов, чтобы они обменивались данными. Например, заявки с сайта сами попадают в CRM.' },
  { term: 'Эскалация', cat: 'Автоматизация', def: 'Передача задачи «наверх» — живому человеку, когда автоматика не справляется или вопрос сложный.' },

  { term: 'ИИ-агент', cat: 'ИИ', def: 'Помощник на базе ИИ, который не просто отвечает, а выполняет цепочку действий: понял запрос → нашёл данные → сделал операцию → при необходимости позвал человека.' },
  { term: 'Чат-бот', cat: 'ИИ', def: 'Программа, которая общается с клиентом текстом в чате. Отвечает на вопросы, принимает заявки, помогает выбрать.' },
  { term: 'База знаний (RAG)', cat: 'ИИ', def: 'Набор ваших документов и правил, по которым ИИ отвечает. Благодаря ей бот говорит по вашим регламентам, а не «выдумывает».' },
  { term: 'Промпт', cat: 'ИИ', def: 'Текстовая инструкция для нейросети — что именно нужно сделать. От формулировки зависит результат.' },
  { term: 'Дообучение', cat: 'ИИ', def: 'Настройка ИИ под конкретный бизнес: на ваших примерах и данных, чтобы отвечал вашим языком и в вашем стиле.' },

  { term: 'CRM', cat: 'Данные', def: 'Система учёта клиентов и сделок. Хранит контакты, историю общения, этап сделки — всё в одном месте.' },
  { term: 'Дашборд', cat: 'Данные', def: 'Экран с ключевыми цифрами: выручка, заявки, конверсия. Позволяет понять положение дел за пару секунд.' },
  { term: 'Сегмент', cat: 'Данные', def: 'Группа клиентов по общему признаку (например, «покупали более месяца назад»). Нужен для точных рассылок и предложений.' },
  { term: 'API', cat: 'Данные', def: 'Способ, которым программы «разговаривают» друг с другом. Благодаря ему сервисы можно связать между собой.' },
]

const catColor: Record<Cat, string> = {
  Продажи: 'var(--color-accent)',
  Автоматизация: 'var(--color-mint)',
  ИИ: '#7C6BFF',
  Данные: '#2C93FF',
}

export default function Glossary() {
  const [q, setQ] = useState('')
  const [active, setActive] = useState<Cat | null>(null)

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    return terms.filter(
      (t) =>
        (!active || t.cat === active) &&
        (!query || t.term.toLowerCase().includes(query) || t.def.toLowerCase().includes(query)),
    )
  }, [q, active])

  return (
    <main className="mx-auto max-w-[1280px] px-6 py-12">
      <div className="max-w-[60ch]">
        <span className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
          Словарь
        </span>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
          Понятным языком об автоматизации
        </h1>
        <p className="mt-4 text-[1.08rem] text-ink-soft">
          Никакого птичьего языка. Здесь простыми словами объяснены термины, которые встречаются
          при работе с Пульсом — от «лида» до «ИИ-агента».
        </p>
      </div>

      {/* поиск + фильтры */}
      <div className="mt-9 flex flex-col gap-4">
        <div className="relative max-w-[420px]">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск термина…"
            className="w-full rounded-xl border border-line bg-surface py-[0.7em] pl-11 pr-4 text-[0.98rem] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive(null)}
            className={`rounded-full border px-4 py-1.5 text-[0.85rem] font-medium transition-colors ${
              active === null ? 'border-transparent bg-ink text-bg' : 'border-line text-ink-soft hover:text-ink'
            }`}
          >
            Все
          </button>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(active === c ? null : c)}
              className={`rounded-full border px-4 py-1.5 text-[0.85rem] font-medium transition-colors ${
                active === c ? 'border-transparent bg-ink text-bg' : 'border-line text-ink-soft hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* карточки */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <article key={t.term} className="rounded-[18px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(16,20,26,0.04),0_12px_34px_-14px_rgba(16,20,26,0.10)]">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: catColor[t.cat] }} />
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-mute">{t.cat}</span>
            </div>
            <h2 className="mb-2 text-[1.2rem] font-bold tracking-[-0.02em]">{t.term}</h2>
            <p className="text-[0.95rem] text-ink-soft">{t.def}</p>
          </article>
        ))}
        {list.length === 0 && (
          <p className="text-ink-soft">Ничего не нашлось. Попробуйте другой запрос.</p>
        )}
      </div>
    </main>
  )
}
