import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/**/*.test.{js,jsx}'], // Vitestで実行するテストファイルのパターン
    environment: 'jsdom', // テスト実行環境を指定
    setupFiles: ['src/setupTests.js'],
  },
});