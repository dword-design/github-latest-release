import { defineConfig } from 'wxt';

export default defineConfig({
  autoIcons: { developmentIndicator: false },
  manifest: {
    host_permissions: ['https://api.github.com/*'],
    name: 'GitHub Latest Release',
  },
  modules: ['@wxt-dev/auto-icons'],
});
