import { property } from '@dword-design/functions';
import { handleError } from '@dword-design/github-web-extension-utils';
import axios from 'axios';

import { TOKEN_KEY } from './model/constants.js';

const token = localStorage.getItem(TOKEN_KEY);
const github = axios.create({ baseURL: 'https://api.github.com' });

const run = async () => {
  if (
    document
      .querySelector('meta[name="route-pattern"]')
      .getAttribute('content') !== '/:user_id/:repository'
  ) {
    return;
  }

  const scopedName = window.location.pathname.slice(1);
  const [author, name] = scopedName.split('/');

  try {
    const latestRelease =
      github.get(`/repos/${author}/${name}/releases/latest`, {
        ...(token && { headers: { Authorization: `token ${token}` } }),
      })
      |> await
      |> property('data.tag_name');

    const headline = document.querySelector('[itemprop=name]').parentElement;
    let latestReleaseSpan = headline.querySelector('.github-latest-release');

    if (latestReleaseSpan) {
      latestReleaseSpan.remove();
    }

    latestReleaseSpan = document.createElement('span');
    latestReleaseSpan.innerText = latestRelease;
    latestReleaseSpan.classList.add('github-latest-release', 'Label');
    headline.append(latestReleaseSpan);
  } catch (error) {
    handleError(error, {
      name: 'GitHub Latest Release',
      slug: 'github-latest-release',
    });
  }
};

run();
