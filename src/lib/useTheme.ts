import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function initial(): Theme {
  const saved = localStorage.getItem('puls-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Тема сайта: читает системную, запоминает выбор, штампует data-theme на <html>. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('puls-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}
