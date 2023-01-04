<script lang="ts">
  import MaximizeSvg from './MaximizeSvg.svelte';
  import ShrinkSvg from './ShrinkSvg.svelte';
  export let expandable: boolean;
</script>

{#if expandable}
  <MaximizeSvg />
{:else}
  <ShrinkSvg />
{/if}
