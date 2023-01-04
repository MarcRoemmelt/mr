<script lang="ts">
  import type { App } from '@mr/stores';
  import { onMount } from 'svelte';
  import { textEditorStore } from './text-editor.store';
  import TextEditorCursor from './TextEditorCursor.svelte';
  import TextEditorLine from './TextEditorLine.svelte';
  import TextEditorSave from './TextEditorSave.svelte';

  export let app: App<string>;

  const { setCursor, activeLineIndex, lines, showLineNumber } =
    textEditorStore;
  const { isActive } = app;

  onMount(() => {
      window.addEventListener('keydown', textEditorStore.handleKeydown);
      window.addEventListener('keypress', textEditorStore.handleKeyPress);
    return () => {

      window.removeEventListener('keypress', textEditorStore.handleKeyPress);
      window.removeEventListener('keydown', textEditorStore.handleKeydown);
    }
  })
</script>

<div on:click={setCursor} on:keyup>
  {#each $lines as text, lineNumber}
    <TextEditorLine
      showLineNumber={$showLineNumber}
      {lineNumber}
      {text}
      isActive={lineNumber === $activeLineIndex}
    />
  {/each}
  <TextEditorCursor
    showLineNumber={$showLineNumber}
    isActive={$isActive}
  />
</div>

<TextEditorSave />

<style lang="scss">
  div {
    margin-top: 1.6rem;
    position: relative;
    height: 100%;
    width: 100%;
    color: rgb(191, 191, 191);
    background: rgb(38, 38, 38);
    letter-spacing: 0;
    font-family: 'Ubuntu Mono', monospace;
    overflow: auto;

    cursor: text;
  }
</style>
