import { App, File } from '@mr/stores';
import { textEditorStore } from './text-editor.store';

export * from './files/cv/cv';

export class TextEditor extends App<string> {
  name = 'TextEditor';
  isFavorite = true;
  componentLoader = () => import('./TextEditor.svelte');
  favoriteIconLoader = () => import('./TextEditorIcon.svelte');

  appStore = textEditorStore;

  async openFile(file: File<TextEditor, string>) {
    const data = await file.data;
    this.appStore.openFile(data);
  }
}
