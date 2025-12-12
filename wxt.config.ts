import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    host_permissions: ['https://api.github.com/*'],
    name: 'GitHub Latest Release',
  },
});
