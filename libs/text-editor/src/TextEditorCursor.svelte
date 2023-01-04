<script lang="ts">
  import { textEditorStore } from './text-editor.store';
  export let showLineNumber: boolean;
  export let isActive: boolean;

  const { cursorPosition } = textEditorStore;
  let visibility: 'visible' | 'hidden' = 'hidden';
  const toggleCursor = (isActive: boolean) => {
    if (isActive && visibility === 'hidden') visibility = 'visible';
    else visibility = 'hidden';
  };
  const blink = () => {
    toggleCursor(isActive);
    if (!isActive) return;
    setTimeout(() => window.requestAnimationFrame(blink), 500);
  };
  $: isActive && blink();
  $: $cursorPosition && (visibility = 'visible');
</script>

<div class="cursor" style:top={$cursorPosition.top} style:left={$cursorPosition.left}>
  {#if showLineNumber}<div class="line-number-spacer" />{/if}
  <div class="inner" style:visibility />
</div>

<style lang="scss">
  .cursor {
    position: absolute;
    display: flex;

    .line-number-spacer {
      width: 24px;
      margin-right: 4px;
    }
    .inner {
      width: 1px;
      height: 1em;
      background: currentColor;
    }
  }
</style>
