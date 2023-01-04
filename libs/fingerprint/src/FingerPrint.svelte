<script lang="ts">
  import { onMount } from 'svelte';
  import type { FingerPrintStore } from './finger-print.store';
  import { fingerPrintStore } from './finger-print.store';

  export let store: FingerPrintStore = fingerPrintStore;

  let rect1: HTMLElement;
  let rect2: HTMLElement;
  let rect3: HTMLElement;
  onMount(() => {
    store.getClientRectFingerprint(rect1, rect2, rect3);
    store.getCpuBenchmarkFingerprint();
    store.getMouseSpeedFingerprint();
    store.getScrollFingerprint();
  });
</script>

<section class="wrapper">
<div>{store.title}</div>
<div>{store.description}</div>
<div class="client-rects">
  <div bind:this={rect1} class="rect-1"><h1>Some rect</h1></div>
  <div bind:this={rect2} class="rect-2"><span>to fingerprint</span></div>
  <div bind:this={rect3} class="rect-3">your device</div>
</div>
</section>

<style lang="scss">
  .wrapper {
    margin-top: 1.6rem;
    position: relative;
    height: 100%;
    width: 100%;
    color: rgb(191, 191, 191);
    background: rgb(38, 38, 38);
  }

  .client-rects {
    white-space: nowrap;
    top: 22.777px;
    left: 12.2993px;
    padding: 4.2219px;
    position: absolute;
    visibility: hidden;
    transform-origin: 0.1111px 0.2222px 0.3333px;
    transform: scale(100000000000000000000009999999999999.99, 1.89)
      matrix3d(
        0.373513,
        -0.0440105,
        0,
        -0.000202461,
        -0.0851682,
        0.616234,
        0,
        -0.00123197,
        2.17,
        0.21,
        1,
        0.02,
        13.81,
        2.11,
        0,
        0.98
      );
  }
  .rect-1 {
    font-size: 24.223px;
  }
  .rect-2 {
    font-size: 13.333px;
  }
  .rect-3 {
    font-size: 29.778px;
  }
</style>
