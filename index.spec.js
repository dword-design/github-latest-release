import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import { execaCommand } from 'execa'
import P from 'path'

export default tester(
  {
    async 'no release'() {
      await this.page.goto('https://github.com/github-latest-release/repo2', {
        waitUntil: 'networkidle0',
      })

      const header = await this.page.waitForSelector(
        '#repository-container-header',
      )
      expect(await header.screenshot()).toMatchImageSnapshot(this)
    },
    async works() {
      await this.page.goto('https://github.com/github-latest-release/repo1', {
        waitUntil: 'networkidle0',
      })

      const header = await this.page.waitForSelector(
        '#repository-container-header',
      )
      expect(await header.screenshot()).toMatchImageSnapshot(this)
    },
  },
  [
    { before: () => execaCommand('base prepublishOnly') },
    testerPluginPuppeteer({
      launchOptions: {
        args: [
          `--load-extension=${P.join(process.cwd(), 'dist', 'chrome')}`,
          `--disable-extensions-except=${P.join(process.cwd(), 'dist', 'chrome')}`,
        ],
        headless: false,
      },
    }),
  ],
)
