import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  chromiumArgs: ['https://github.com/dword-design/base'],
  chromiumProfile: 'userdata', // chromiumArgs: ['--user-data-dir=userdata'] doesn't keep sessions across dev restarts,
  keepProfileChanges: true,
});
