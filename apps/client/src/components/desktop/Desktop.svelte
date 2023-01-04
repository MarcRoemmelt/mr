<script lang="ts">
  import { FingerPrint } from '@mr/fingerprint';
  import { TextEditor, CV } from '@mr/text-editor';
  import { appStore } from '@mr/stores';

  import IconsContainer from './IconsContainer.svelte';
  import SideBar from './SideBar.svelte';
  import TopBar from './TopBar.svelte';
  import FossaSvg from './FossaSvg.svelte';

  appStore.install(FingerPrint);
  appStore.install(TextEditor);
  appStore.registerFile(CV);
  const { openAppsList } = appStore;
</script>

<div class="desktop">
  <main>
    <FossaSvg />
    <TopBar />
    <SideBar />
    <IconsContainer />
    {#if $openAppsList.length > 0}
      {#await import('./WindowContainer.svelte') then { default: WindowContainer }}
        <WindowContainer />
      {/await}
    {/if}
  </main>
</div>

<style>
  .desktop {
    background: linear-gradient(
      185deg,
      rgb(221, 72, 20) -13%,
      rgb(119, 33, 111) 35%,
      rgb(44, 0, 30) 95%
    );
    width: 100%;
    height: 100%;
  }
</style>
