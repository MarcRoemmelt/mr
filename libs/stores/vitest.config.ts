import { mergeConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import baseConfig from '../../vitest.config';

const config = mergeConfig(baseConfig, {
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    passWithNoTests: true,
  },
});

export default config;
