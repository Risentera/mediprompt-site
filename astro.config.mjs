// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages project site. Change `site`/`base` together when a custom
  // domain is chosen; with a domain, drop `base` so URLs are at root.
  site: 'https://risentera.github.io',
  base: '/mediprompt-site',
  output: 'static',
});
