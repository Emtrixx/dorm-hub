import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      // utils/auth.js reads this at import time
      JWT_SECRET: 'test-secret'
    },
    // first run downloads the mongodb-memory-server binary
    hookTimeout: 120000,
    fileParallelism: false
  }
})
