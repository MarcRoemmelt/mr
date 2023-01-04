<script lang="ts">
  import { DateTime } from '@mr/core';
</script>

<div class="top-bar">
  <div class="activities">Activities</div>
  <DateTime />
</div>

<style>
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(1em + 8px);
    padding: 4px 6px;

    background: rgb(41, 41, 41);
    color: white;
    letter-spacing: -0.05em;

    display: flex;
    justify-content: space-around;
    user-select: none;
  }
</style>
