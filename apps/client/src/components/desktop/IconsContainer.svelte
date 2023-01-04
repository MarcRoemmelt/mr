<script lang="ts">
  import { appStore } from '@mr/stores';

  const { appList, fileList } = appStore;
</script>

<div class="desktop-icons">
  {#each $fileList as file}
    {#await file.icon then Icon}
      <Icon {file} on:click={() => file.open()} />
    {/await}
  {/each}
</div>

<style lang="scss">
  .desktop-icons {
    $side-bar-width: 72px;
    $top-bar-height: calc(1em + 8px);

    position: absolute;
    top: $top-bar-height;
    left: $side-bar-width;
    width: calc(100% - $side-bar-width);
    height: calc(100% - $top-bar-height);
  }
</style>
