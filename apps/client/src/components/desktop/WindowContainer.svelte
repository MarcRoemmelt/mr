<script lang="ts">
  import { appStore } from '@mr/stores';
  const { openAppsList } = appStore;
</script>

<section id="windows-area">
  {#each $openAppsList as app (app.name)}
    {#await app.component then App}
      {#await import('@mr/core') then { Window }}
        <Window {app}><svelte:component this={App} app={app} /></Window>
      {/await}
    {/await}
  {/each}
</section>

<style lang="scss">
  section {
    $side-bar-width: 64px;
    $top-bar-height: calc(1em + 8px);

    position: absolute;
    top: $top-bar-height;
    left: $side-bar-width;
    width: calc(100% - $side-bar-width);
    height: calc(100% - $top-bar-height);
    pointer-events: none;
  }
</style>
