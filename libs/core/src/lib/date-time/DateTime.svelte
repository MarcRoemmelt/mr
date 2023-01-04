<script lang="ts">
  import { onMount } from 'svelte';
  import { Clock } from './date-time';
  const clock = new Clock();
  const { time } = clock;

  onMount(clock.start);
</script>

<div class="date-time">{$time.toString()}</div>

<style lang="scss">
  .date-time {
    height: 100%;
    margin: auto;
    line-height: 1em;
  }
</style>
