import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // React Testing Libraryはjsdomを使用
    globals: true, // `expect` などのグローバルなテストユーティリティを使えるようにする
    setupFiles: ['./src/setupTests.js'], // ここでテスト環境のセットアップを行う
  }, 
});
