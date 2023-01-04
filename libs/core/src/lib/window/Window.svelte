<script lang="ts">
  import { draggable } from '@neodrag/svelte';
  import { onMount } from 'svelte';
  import { sineInOut } from 'svelte/easing';
  import { noop } from 'svelte/internal';

  import { App, theme, prefersReducedMotion } from '@mr/stores';

  import WindowControls from './window-controls/WindowControls.svelte';
  import { Window } from './window';

  export let app: App;

  let windowEl: HTMLElement;
  const {
    draggingEnabled,
    height,
    width,
    position,
    zIndex,
    init,
    onBlur,
    onClose,
    onFocus,
    onMaximize,
    onMinimize,
    onDragStart,
    onDragEnd,
  } = new Window(app);

  const windowCloseTransition = (
    el: HTMLElement,
    { duration = $prefersReducedMotion ? 0 : 300 }: SvelteTransitionConfig = {}
  ): SvelteTransitionReturnType => {
    const existingTransform = window.getComputedStyle(el).transform;
    return {
      duration,
      easing: sineInOut,
      css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
    };
  };

  const draggableOptions = {
    defaultPosition: position,
    handle: '.app-window-drag-handle',
    bounds: { bottom: -6000, top: 24, left: -6000, right: -6000 },
    disabled: !draggingEnabled,
    onDragStart,
    onDragEnd,
  };

  onMount(() => {
    init(windowEl);
  });
</script>

<section
  class="container"
  class:dark={$theme.scheme === 'dark'}
  style:width="{+width}px"
  style:height="{+height}px"
  style:z-index={$zIndex}
  tabindex="-1"
  bind:this={windowEl}
  use:draggable={draggableOptions}
  on:click={onFocus}
  on:blur={onBlur}
  on:keydown={noop}
  out:windowCloseTransition
>
  <header class="app-window-drag-handle" on:dblclick={onMaximize}>
    <WindowControls
      {app}
      on:minimize-click={onMinimize}
      on:maximize-click={onMaximize}
      on:close-app={onClose}
    />
  </header>
  <slot />
  <div class="border" />
</section>

<style lang="scss">
  $border-radius: 5px;
  $-border: 1px solid rgb(16, 16, 16);
  $-header-height: 1.6rem;

  header {
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: rgb(45, 45, 45);
    border-radius: $border-radius $border-radius 0 0;
  }
  .border {
    width: 100%;
    height: 100%;
    position: absolute;
    top: $-header-height;
    left: 0;
    border: $-border;
    pointer-events: none;
  }
  .container {
    pointer-events: all;
    --elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115),
      0px 68px 80px rgba(0, 0, 0, 0.23);
    width: 100%;
    height: 100%;
    position: absolute;
    will-change: width, height;
    box-shadow: var(--elevated-shadow);
    cursor: var(--system-cursor-default), auto;

    &:focus-visible {
      outline: none;
    }
    &:focus, &:focus-within {
      --elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28),
        0px 68px 80px rgba(0, 0, 0, 0.56);

      header {
        background: rgb(33, 33, 33);
      }
    }

    &.dark {
      & > :global(section),
      & > :global(div) {
        border-radius: inherit;
        box-shadow: inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
          0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
          var(--elevated-shadow);
      }
    }
  }
</style>
