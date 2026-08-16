import { useEffect, useRef } from 'react'

/** Живой «бизнес-монитор»: ЭКГ-линия пульса на Canvas — сигнатурный мотив бренда. */
export default function PulseMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rect = { width: 0, height: 0 }
    let raf = 0
    let off = 0

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#FF4B57'

    const fit = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rect = { width: r.width, height: r.height }
    }
    fit()
    window.addEventListener('resize', fit)

    // форма одного сердечного удара
    const beatY = (x: number, h: number) => {
      const mid = h * 0.55
      const p = x % 160
      if (p < 70 || p > 110) return mid
      const t = (p - 70) / 40
      if (t < 0.2) return mid + Math.sin((t / 0.2) * Math.PI) * 6
      if (t < 0.4) return mid - ((t - 0.2) / 0.2) * (h * 0.32)
      if (t < 0.55) return mid - h * 0.32 + ((t - 0.4) / 0.15) * (h * 0.42)
      if (t < 0.75) return mid + h * 0.1 - ((t - 0.55) / 0.2) * (h * 0.14)
      return mid
    }

    const draw = () => {
      const { width: w, height: h } = rect
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 1
      for (let gy = 0; gy < h; gy += 24) {
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(w, gy)
        ctx.stroke()
      }
      const col = accent()
      ctx.lineWidth = 2.4
      ctx.strokeStyle = col
      ctx.shadowColor = col
      ctx.shadowBlur = 12
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.beginPath()
      for (let x = 0; x <= w; x += 2) {
        const y = beatY(x + off, h)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // скорость привязана ко времени (px/сек) — плавно при любой частоте кадров
    let last = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(50, t - last)
      last = t
      off += dt * 0.09
      draw()
      raf = requestAnimationFrame(loop)
    }

    if (reduce) draw()
    else raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', fit)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="rounded-2xl border border-[var(--color-panel-line)] bg-[#0A0D12] p-4 pb-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="mb-2 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.1em] text-panel-soft">
        <span>business_monitor</span>
        <span className="flex items-center gap-2 text-[#FF6A73]">
          <span className="beat h-[7px] w-[7px] rounded-full bg-accent" />
          online
        </span>
      </div>
      <canvas ref={canvasRef} className="block h-[120px] w-full" aria-hidden="true" />
      <div className="mt-1 flex justify-between font-mono text-[0.7rem] text-panel-soft">
        <span>
          заявок обработано: <b className="text-mint">128</b>
        </span>
        <span>
          вручную: <b className="text-mint">0</b>
        </span>
      </div>
    </div>
  )
}
