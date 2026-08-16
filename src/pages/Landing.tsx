import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import PulseMonitor from '../components/PulseMonitor'

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const Wrap = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto max-w-[1280px] px-6">{children}</div>
)

const Eyebrow = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em] ${className}`}>
    {children}
  </span>
)

const check = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const pains = [
  { t: 'Заявки', h: 'Лид ждёт ответа', p: 'Клиент написал в 9 утра, менеджер увидел в обед. Половина уходит к конкуренту.', c: '↳ до 30% продаж мимо' },
  { t: 'Счета', h: 'Счета и акты вручную', p: 'Каждый документ — заново шаблон, реквизиты, отправка. И так по кругу.', c: '↳ ~4 часа в неделю' },
  { t: 'Напоминания', h: 'Забытые follow-up', p: '«Перезвоню завтра» превращается в никогда. Тёплые клиенты остывают.', c: '↳ потерянная выручка' },
  { t: 'Отчёты', h: 'Непонятно, что работает', p: 'Цифры в трёх таблицах, сводить некогда. Решения — на ощущение.', c: '↳ вслепую' },
]

const steps = [
  { n: '01', h: 'Опишите задачу словами', p: '«Когда приходит заявка — ответить, создать сделку и напомнить менеджеру». Пульс превращает фразу в сценарий.' },
  { n: '02', h: 'Подтвердите и подправьте', p: 'Проверяете шаги, меняете тексты и условия под себя. Всё наглядно, без кода.' },
  { n: '03', h: 'Включите — и забудьте', p: 'Сценарий работает 24/7. Вы получаете результат и отчёт, а не новую задачу.' },
]

const features = [
  { h: 'Заявки со всех каналов', p: 'Сайт, мессенджеры, звонки — всё падает в одну ленту и мгновенно уходит в работу.', d: 'M4 4h16v12H7l-3 3V4z' },
  { h: 'Счета и документы', p: 'Счёт, акт, договор — по шаблону за секунду, с автоотправкой клиенту.', d: 'M6 3h9l3 3v15H6z' },
  { h: 'Напоминания и follow-up', p: 'Ни один клиент не забыт: система сама напомнит и вам, и ему в нужный момент.', d: 'M12 8v4l3 2' },
  { h: 'Отчёты в реальном времени', p: 'Выручка, воронка, источники — на одном экране. Видно, что приносит деньги.', d: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
  { h: 'Рассылки и повторные продажи', p: 'Сегменты, поводы, тексты от ИИ — тёплая база возвращается сама.', d: 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9L9.5 8z' },
  { h: 'Задачи для команды', p: 'Сценарий ставит задачи сам и следит за сроками. Никто ничего не теряет.', d: 'M3 5h18v14H3zM3 9h18' },
]

export default function Landing() {
  const [toast, setToast] = useState(false)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    if (!name || !email || !email.includes('@')) {
      ;(name ? (form.elements.namedItem('email') as HTMLInputElement) : (form.elements.namedItem('name') as HTMLInputElement)).focus()
      return
    }
    setToast(true)
    form.reset()
    setTimeout(() => setToast(false), 3200)
  }

  return (
    <main>
      {/* HERO */}
      <header className="pt-[34px] pb-[26px]">
        <Wrap>
          <div className="overflow-hidden rounded-[26px] border border-panel-line bg-panel px-6 pt-11 text-panel-ink sm:px-14 sm:pt-16">
            <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="order-2 lg:order-1">
                <Eyebrow className="text-[#FF6A73]">Автоматизация для малого бизнеса</Eyebrow>
                <h1 className="mt-[18px] font-display text-[clamp(2.6rem,6.4vw,4.9rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-balance">
                  Ваш бизнес<br />на <span className="text-accent">автопилоте</span>
                </h1>
                <p className="mt-[22px] max-w-[34ch] text-[1.14rem] text-panel-soft">
                  Пульс забирает рутину — заявки, счета, напоминания и отчёты — чтобы вы занимались ростом, а не операционкой.
                </p>
                <div className="mt-[30px] flex flex-wrap gap-3">
                  <button onClick={() => scrollTo('signup')} className="rounded-xl bg-accent-bg px-[1.4em] py-[0.85em] font-semibold text-white transition-colors hover:bg-accent-bg-hov">
                    Подключить бесплатно →
                  </button>
                  <button onClick={() => scrollTo('how')} className="rounded-xl border border-panel-line px-[1.4em] py-[0.85em] font-semibold text-panel-ink transition-colors hover:border-panel-soft">
                    Как это работает
                  </button>
                </div>
              </div>
              <div className="order-1 flex flex-col justify-end pb-0 lg:order-2 lg:pb-10">
                <PulseMonitor />
              </div>
            </div>

            <div className="mt-11 flex flex-wrap gap-8 border-t border-panel-line py-9">
              {[
                ['−11 ч', 'рутины в неделю', true],
                ['+32%', 'быстрее ответ клиенту', true],
                ['6 мин', 'на настройку сценария', false],
                ['0 ₽', 'за старт', false],
              ].map(([n, l, hl]) => (
                <div key={l as string}>
                  <div className="font-display text-[2.1rem] font-extrabold tracking-[-0.03em] tabular-nums">
                    <span className={hl ? 'text-accent' : ''}>{n}</span>
                  </div>
                  <div className="mt-0.5 text-[0.82rem] text-panel-soft">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </header>

      {/* PAIN */}
      <section id="pain" className="py-[76px]">
        <Wrap>
          <div className="max-w-[56ch]">
            <Eyebrow className="text-accent">Знакомо?</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.05] text-balance">
              Рутина не спит — и крадёт ваш день по кусочкам
            </h2>
            <p className="mt-4 max-w-[52ch] text-[1.08rem] text-ink-soft">
              Пока вы вручную гоняете заявки и напоминания, деньги утекают в мелочах, которые давно пора отдать роботу.
            </p>
          </div>
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pains.map((x) => (
              <div key={x.h} className="rounded-[18px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(16,20,26,0.04),0_12px_34px_-14px_rgba(16,20,26,0.12)]">
                <div className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-mute">{x.t}</div>
                <h3 className="mt-3.5 mb-2 text-[1.15rem] font-bold tracking-[-0.02em]">{x.h}</h3>
                <p className="text-[0.95rem] text-ink-soft">{x.p}</p>
                <div className="mt-4 font-mono text-[0.78rem] text-accent">{x.c}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* HOW */}
      <section id="how" className="pb-[76px] pt-1">
        <Wrap>
          <div className="max-w-[56ch]">
            <Eyebrow className="text-accent">Идея → сценарий → автопилот</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.05] text-balance">
              Три шага — и рутина работает сама
            </h2>
          </div>
          <div className="mt-12 grid overflow-hidden rounded-[18px] border border-line bg-surface lg:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} className={`p-9 ${i < steps.length - 1 ? 'border-b border-line lg:border-b-0 lg:border-r' : ''}`}>
                <div className="font-mono text-[0.8rem] font-semibold text-accent">{s.n}</div>
                <h3 className="mt-4 mb-2.5 text-[1.3rem] font-extrabold tracking-[-0.025em]">{s.h}</h3>
                <p className="text-[0.98rem] text-ink-soft">{s.p}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* FEATURES */}
      <section id="features" className="pb-[76px] pt-1">
        <Wrap>
          <div className="max-w-[56ch]">
            <Eyebrow className="text-accent">Что берёт на себя Пульс</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.05] text-balance">
              Один инструмент вместо десятка вкладок
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.h} className="rounded-[18px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(16,20,26,0.04),0_12px_34px_-14px_rgba(16,20,26,0.12)] transition-transform hover:-translate-y-1 hover:border-line-strong">
                <div className="mb-4 grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[color-mix(in_srgb,var(--color-accent)_12%,transparent)] text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d={f.d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[1.12rem] font-bold tracking-[-0.02em]">{f.h}</h3>
                <p className="text-[0.95rem] text-ink-soft">{f.p}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* METRICS */}
      <section className="pb-[76px] pt-1">
        <Wrap>
          <div className="grid items-center gap-8 rounded-[26px] border border-panel-line bg-panel p-10 text-panel-ink sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] sm:p-13">
            <div>
              <Eyebrow className="text-[#FF6A73]">Результат за 30 дней</Eyebrow>
              <h2 className="mt-2.5 text-[1.7rem] font-extrabold leading-[1.1]">Цифры, которые чувствует касса</h2>
            </div>
            {[['×2,4', 'скорость ответа лиду'], ['−73%', 'ручных операций'], ['+18%', 'к повторным продажам']].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-[2.6rem] font-extrabold tracking-[-0.03em] text-accent tabular-nums">{n}</div>
                <div className="mt-1 text-[0.9rem] text-panel-soft">{l}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* LEAD MAGNET */}
      <section className="pb-[76px]">
        <Wrap>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[18px] border border-dashed border-line-strong bg-surface p-8">
            <div>
              <Eyebrow className="text-mint">Бесплатный чек-лист</Eyebrow>
              <h3 className="mt-2 mb-1.5 text-[1.5rem] font-extrabold tracking-[-0.025em]">17 задач, которые пора отдать роботу</h3>
              <p className="max-w-[46ch] text-[0.98rem] text-ink-soft">
                Пройдитесь по списку и отметьте, что делаете руками — посчитаем, сколько часов в неделю рутина стоит вам сейчас.
              </p>
            </div>
            <Link to="/checklist" className="rounded-xl bg-accent-bg px-[1.4em] py-[0.85em] font-semibold text-white transition-colors hover:bg-accent-bg-hov">
              Открыть чек-лист →
            </Link>
          </div>
        </Wrap>
      </section>

      {/* SIGNUP */}
      <section id="signup" className="pb-[76px]">
        <Wrap>
          <div className="grid gap-11 rounded-[26px] border border-panel-line bg-panel p-8 text-panel-ink sm:p-12 lg:grid-cols-2">
            <div>
              <Eyebrow className="text-[#FF6A73]">Старт за 6 минут</Eyebrow>
              <h2 className="mt-3.5 mb-3.5 text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-[1.05]">Соберите первый автопилот сегодня</h2>
              <p className="text-[1rem] text-panel-soft">Оставьте контакты — пришлём доступ и поможем настроить первый сценарий под ваш бизнес.</p>
              <ul className="mt-[22px] flex flex-col gap-3">
                {['Бесплатный тариф без карты', 'Перенос данных из таблиц и CRM', 'Живой специалист на запуске'].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[0.96rem]">
                    <span className="mt-0.5 text-mint">{check}</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
              {[
                ['name', 'Имя', 'text', 'Как к вам обращаться'],
                ['email', 'E-mail', 'email', 'you@company.ru'],
                ['phone', 'Телефон', 'tel', '+7 900 000-00-00'],
              ].map(([name, label, type, ph]) => (
                <div key={name}>
                  <label htmlFor={name} className="mb-1.5 block font-mono text-[0.8rem] uppercase tracking-[0.04em] text-panel-soft">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={ph}
                    className="w-full rounded-[11px] border border-panel-line bg-[#0A0D12] px-4 py-[0.85em] text-[1rem] text-panel-ink placeholder:text-[#5c6672] focus:border-accent focus:outline-none"
                  />
                </div>
              ))}
              <button type="submit" className="mt-1.5 rounded-xl bg-accent-bg p-[1em] text-center text-[1.02rem] font-semibold text-white transition-colors hover:bg-accent-bg-hov">
                Получить доступ
              </button>
              <p className="text-center text-[0.78rem] text-panel-soft">
                Нажимая кнопку, вы соглашаетесь на обработку данных. Это демо-страница портфолио — заявка никуда не отправляется.
              </p>
            </form>
          </div>
        </Wrap>
      </section>

      {/* TOAST */}
      <div
        className={`fixed bottom-7 left-1/2 z-[99] -translate-x-1/2 rounded-xl bg-mint px-6 py-[0.9em] font-bold text-[#04140d] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)] transition-all ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
        role="status"
      >
        Заявка отправлена — мы на связи! (демо)
      </div>
    </main>
  )
}
