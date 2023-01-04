<script lang="ts">
  import BootSequence from './boot-sequence/BootSequence.svelte';

  let isBooting = true;
  const createDesktop = () => {
    isBooting = false;
  };

  const desktopLoader = import('./desktop/Desktop.svelte');
</script>

{#if isBooting}
  <BootSequence on:ready={createDesktop} />
{:else}
  {#await desktopLoader then { default: Desktop }}
    <Desktop />
  {/await}
{/if}
