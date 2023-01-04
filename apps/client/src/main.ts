import './fonts.css';
import './global.css';

import { initTheme } from '@mr/stores';

import App from './components/App.svelte';
import { colors } from './configs/colors.config';

initTheme(colors);

const app = new App({
  target: document.body,
});

export default app;
