<script lang="ts">
  import TextEditorIcon from "./TextEditorIcon.svelte";
</script>

<div class="wrapper" title="Text Editor" on:click on:keydown>
  <div class="background" />
  <TextEditorIcon />
</div>

<style lang="scss">
  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    width: 64px;
    overflow: hidden;
    padding: 8px;
    cursor: pointer;

    .background {
      position: absolute;
      z-index: 0;
      border-radius: 10px;
      width: 100%;
      height: 100%;
      opacity: 0;
      will-change: opacity;
      transition: opacity 100ms ease;
      background: rgb(108, 108, 108);
    }

    &:hover .background {
      opacity: 0.4;
    }
  }
</style>
