<script lang="ts">
    import { appStore } from "@mr/stores";
  
    const { appList } = appStore;
</script>

<div class="menu-bar">
    {#each $appList as app}
        {#if app.isFavorite}
            {#await app.favoriteIcon then Icon}
                <Icon on:click={() => app.open()} />
            {/await}
        {/if}
    {/each}
</div>

<style lang="scss">
	.menu-bar {
        position: fixed;
        top: calc(1em + 8px);
        left: 0;
        width: 64px + 8px;
        padding: 4px;
        height: calc(100% - calc(1em + 8px));
        background: rgba(0, 0, 0, 0.5);
        color: white;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }
</style>
