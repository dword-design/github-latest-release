import { property } from '@dword-design/functions'
import { handleError } from '@dword-design/github-web-extension-utils'
import axios from 'axios'

import { TOKEN_KEY } from './model/constants'

const token = localStorage.getItem(TOKEN_KEY)
const github = axios.create({ baseURL: 'https://api.github.com' })
const run = async () => {
  const $headline = document.querySelector('h1')
  if (!$headline) {
    return
  }
  const $author = $headline.querySelector('[itemprop=author]')
  const $name = $headline.querySelector('[itemprop=name]')
  if (!$author || !$name) {
    return
  }
  const author = $author.innerText
  const name = $name.innerText
  try {
    const latestRelease =
      github.get(`/repos/${author}/${name}/releases/latest`, {
        ...(token && { headers: { Authorization: `token ${token}` } }),
      })
      |> await
      |> property('data.tag_name')
    let $latestRelease = $headline.querySelector('.github-latest-release')
    if ($latestRelease) {
      $latestRelease.remove()
    }
    $latestRelease = document.createElement('span')
    $latestRelease.innerText = latestRelease
    $latestRelease.classList.add(
      'github-latest-release',
      'f5',
      'flex-self-stretch',
      'mr-2'
    )
    $latestRelease.style.lineHeight = 2.1
    $headline.append($latestRelease)
  } catch (error) {
    handleError(error, {
      name: 'GitHub Latest Release',
      slug: 'github-latest-release',
    })
  }
}
run()
