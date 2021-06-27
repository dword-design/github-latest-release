import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import execa from 'execa'
import P from 'path'

export default tester(
  {
    'no release': async function () {
      await this.page.goto('https://github.com/github-latest-release/repo2', {
        waitUntil: 'networkidle0',
      })

      const header = await this.page.waitForSelector('.hx_page-header-bg')
      expect(await header.screenshot()).toMatchImageSnapshot(this)
    },
    async works() {
      await this.page.goto('https://github.com/github-latest-release/repo1', {
        waitUntil: 'networkidle0',
      })

      const header = await this.page.waitForSelector('.hx_page-header-bg')
      expect(await header.screenshot()).toMatchImageSnapshot(this)
    },
  },
  [
    { before: () => execa.command('base prepublishOnly') },
    testerPluginPuppeteer({
      launchOptions: {
        args: [
          `--load-extension=${P.join(process.cwd(), 'dist')}`,
          `--disable-extensions-except=${P.join(process.cwd(), 'dist')}`,
        ],
        headless: false,
      },
    }),
  ]
)
