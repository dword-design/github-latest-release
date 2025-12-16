import { handleError } from '@dword-design/github-web-extension-utils';
import axios, { AxiosError } from 'axios';

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
      const headline =
        document.querySelector('[itemprop=name]')!.parentElement!;

      let latestReleaseSpan = headline.querySelector<HTMLElement>(
        '.github-latest-release',
      );

      if (latestReleaseSpan) {
        latestReleaseSpan.remove();
      }

      const {
        data: { tag_name: latestRelease },
      } = await github
        .get(`/repos/${author}/${name}/releases/latest`, {
          ...(token && { headers: { Authorization: `token ${token}` } }),
        })
        .catch(error => {
          if (error instanceof AxiosError && error.response?.status === 404) {
            return { data: { tag_name: null } };
          }

          throw error;
        });

      latestReleaseSpan = document.createElement('span');
      latestReleaseSpan.classList.add('github-latest-release');

      if (latestRelease) {
        latestReleaseSpan.textContent = latestRelease;
        latestReleaseSpan.classList.add('Label');
      }

      headline.append(latestReleaseSpan);
    } catch (error) {
      console.log('foo');

      handleError(error, {
        name: 'GitHub Latest Release',
        slug: 'github-latest-release',
      });
    }
  },
  matches: ['https://github.com/*'],
});
