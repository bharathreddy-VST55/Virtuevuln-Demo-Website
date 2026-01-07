import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001'
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 5000,
  retries: {
    runMode: 2,
    openMode: 0
  }
});
