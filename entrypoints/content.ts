import { handleError } from '@dword-design/github-web-extension-utils';
import axios from 'axios';

export default defineContentScript({
  main: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const github = axios.create({ baseURL: 'https://api.github.com' });

    if (
      document
        .querySelector('meta[name="route-pattern"]')!
        .getAttribute('content') !== '/:user_id/:repository'
    ) {
      return;
    }

    const scopedName = globalThis.location.pathname.slice(1);
    const [author, name] = scopedName.split('/');

    try {
      const {
        data: { tag_name: latestRelease },
      } = await github.get(`/repos/${author}/${name}/releases/latest`, {
        ...(token && { headers: { Authorization: `token ${token}` } }),
      });

      const headline =
        document.querySelector('[itemprop=name]')!.parentElement!;

      let latestReleaseSpan = headline.querySelector<HTMLElement>(
        '.github-latest-release',
      );

      if (latestReleaseSpan) {
        latestReleaseSpan.remove();
      }

      latestReleaseSpan = document.createElement('span');
      latestReleaseSpan.textContent = latestRelease;
      latestReleaseSpan.classList.add('github-latest-release', 'Label');
      headline.append(latestReleaseSpan);
    } catch (error) {
      handleError(error, {
        name: 'GitHub Latest Release',
        slug: 'github-latest-release',
      });
    }
  },
  matches: ['https://github.com/*'],
});
