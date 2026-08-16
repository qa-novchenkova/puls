import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: '/puls/' — GitHub Pages отдаёт сайт из подпапки с именем репозитория.
// Если репозиторий назовёшь иначе — поменяй тут.
export default defineConfig({
  base: '/puls/',
  plugins: [react(), tailwindcss()],
})
