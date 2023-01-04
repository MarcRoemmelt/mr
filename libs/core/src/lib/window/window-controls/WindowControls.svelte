<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { App } from '@mr/stores';

  import CloseIcon from './CloseSvg.svelte';
  import ResizeWindow from './ResizeWindow.svelte';
  import MinimizeSvg from './MinimizeSvg.svelte';

  export let app: App;
  const { isActive, isExpandable } = app;
  const dispatch = createEventDispatcher();
  function closeApp() {
    dispatch('close-app');
  }
  function maximizeApp() {
    dispatch('maximize-click');
  }
  function minimizeApp() {
    dispatch('minimize-click');
  }
</script>

<div class="container" class:unfocused={!$isActive}>
  <button class="minimize-light"  on:click={minimizeApp}> <MinimizeSvg /> </button>
  <button class="stretch-light" on:click={maximizeApp}>
    <ResizeWindow expandable={isExpandable} />
  </button>
  <button class="close-light" on:click={closeApp}> <CloseIcon /> </button>
</div>

<style lang="scss">
  .container {
    padding: 0.4rem 0.4rem;
    --button-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    height: 100%;

    &.unfocused {
      button:hover {
        --bgcolor: transparent;
      }
      .close-light, .close-light:hover {
        --bgcolor: grey;
      }
    }
    &:hover {
      :global(svg) {
        opacity: 1;
      }
    }
  }
  button {
    --bgcolor: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    height: var(--button-size);
    width: var(--button-size);
    // pointer-events: initial;
    border-radius: 50%;
    background-color: var(--bgcolor);
    border: none;
    color: white;
    transition: transform 100ms ease-in;

    &:hover {
      cursor: pointer;
      --bgcolor: grey;
    }
  }
  .close-light {
    --bgcolor: grey;
    &:hover {  
      --bgcolor: #ff5f56;
    }
  }
  .stretch-light {
    :global(svg) {
      transform: rotate(90deg);
    }
  }
</style>
