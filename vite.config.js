import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 開発は'/'、本番（Pages公開）は'/choppaya/'に自動切替
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/choppaya/' : '/'
}))
