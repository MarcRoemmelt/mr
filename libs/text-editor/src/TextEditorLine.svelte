<script lang="ts">
  import type { Writable } from 'svelte/store';

  export let showLineNumber: boolean;
  export let lineNumber: number;
  export let text: Writable<string>;
  export let isActive: boolean;
</script>

<div id={`text-editor-line-${lineNumber}`} class="line" class:is-active={isActive}>
  {#if showLineNumber}<div class="line-number">{lineNumber}</div>{/if}
  <div class="text">{$text}</div>
</div>

<style lang="scss">
  .line {
    height: 1em;
    line-height: 1em;
    display: flex;

    &.is-active {
      background-color: rgb(49, 49, 49);

      .line-number {
        font-weight: bold;
      }
    }
  }
  .text {
    font-size: 0.8em;
    height: 100%;
    white-space: pre;
  }
  .line-number {
    font-size: 0.8em;
    text-align: right;
    width: 24px;
    height: 100%;
    margin-right: 4px;
    opacity: 0.3;
  }
</style>
