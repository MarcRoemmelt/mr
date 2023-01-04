<script lang="ts">
  import type { File } from '@mr/stores';

  import TextEditorIcon from '../../TextEditorIcon.svelte';

  export let file: File;
</script>

<div class="wrapper" on:click on:keydown>
  <div class="icon-container">
    <TextEditorIcon />
  </div>
  <span class="name-container">{file.name}</span>
</div>

<style lang="scss">
  $-background: rgba(195, 195, 195, 0.3);

  .wrapper {
    font-size: 0.9em;
    width: 156px;
    height: calc(120px + 2em);
    padding: 4px;

    display: flex;
    flex-direction: column;
    align-items: center;

    cursor: pointer;

    .icon-container {
      border-radius: 6px;
      padding: 4px;
      box-sizing: content-box;
      height: 96px;
      width: 96px;
      $factor: 96 / 48;

      :global(svg) {
        transform: scale($factor);
        transform-origin: 0 0;
      }
    }
    .name-container {
      border-radius: 6px;
      padding: 4px;
      text-align: center;
      color: rgb(231, 231, 231);
      text-shadow: 1px 1px 1px rgb(35, 35, 35);
    }

    &:hover {
      .icon-container {
        background: $-background;
      }
      .name-container {
        background: $-background;
      }
    }
  }
</style>
