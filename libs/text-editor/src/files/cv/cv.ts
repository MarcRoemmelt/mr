import { File } from '@mr/stores';

import type { TextEditor } from '../../index';

export class CV extends File<TextEditor> {
  static appName = 'TextEditor';
  name = 'CV Marc Römmelt.txt';
  dataLoader = () => import('./cv-text');
  iconLoader = () => import('./CvIcon.svelte');
}
