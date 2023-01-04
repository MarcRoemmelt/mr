import { App } from '@mr/stores';

export class FingerPrint extends App {
  name = 'FingerPrint';
  isFavorite = true;
  componentLoader = () => import('./FingerPrint.svelte');
  favoriteIconLoader = () => import('./FingerPrintIcon.svelte');
}
