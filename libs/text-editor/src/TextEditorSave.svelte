<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { textEditorStore } from './text-editor.store';

  const { isSaveModalOpen } = textEditorStore;
  let filename = '';
  let modalEl: HTMLDivElement;
  let inputEl: HTMLInputElement;

  const closeModal = (ev: Event) => {
    if ('key' in ev && ev.key !== 'Escape') return;
    isSaveModalOpen.set(false);
    window.removeEventListener('keydown', closeModal);
  };

  const showSaveModal = () => {
    isSaveModalOpen.set(true);
  };

  $: {
    if ($isSaveModalOpen) {
        window.addEventListener('keydown', closeModal);
    }
  }
  const updateFileName = (
    ev: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    filename = ev.currentTarget.value;
  };
  const confirm = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') saveFile();
  }
  const saveFile = () => textEditorStore.saveFile(filename).then(() => isSaveModalOpen.set(false));
</script>

<button
  class="save-button"
  on:click|stopPropagation={showSaveModal}
  title="Save the current file">Save</button
>

{#if $isSaveModalOpen}
  <div class="modal" bind:this={modalEl} on:click|stopPropagation on:keydown>
    <h2>Save file as</h2>
    <input bind:this={inputEl} type="text" name="filename" on:change={updateFileName} on:keydown={confirm} />
    <button
      class="close"
      on:click={closeModal}
    >Cancel</button>
    <button
      class="confirm"
      on:click={saveFile}
    >Save</button>
  </div>
{/if}

<style lang="scss">
  button {
    $-height: 1.6rem;
    appearance: none;

    padding: 0.2em 0.6em;
    margin: 0;
    border: 1px solid rgb(22, 22, 22);
    border-radius: 5px;
    background-color: rgb(59, 59, 59);
    color: rgb(205, 189, 189);

    &:hover {
      background-color: rgb(65, 65, 65);
    }

    &.save-button {
        $-height: 1.6rem;

        position: absolute;
        top: 0;
        right: 4.4rem;

        font-size: $-height * 0.5;
        margin-top: $-height * 0.1;
        height: $-height * 0.8;
        line-height: $-height * 0.75;
        padding: 0 $-height * 0.4;
        padding-bottom: $-height * 0.05;
    }
    &.close {
      color: rgb(225, 215, 215);
      background-color: rgb(146, 1, 1);
      &:hover {
        background-color: rgb(177, 0, 0);
      }
    }
    &.confirm {
      color: rgb(225, 215, 215);
      background-color: rgb(0, 111, 0);
      &:hover {
        background-color: rgb(0, 130, 0);
      }
    }
  }
  .modal {
    position: absolute;
    background: rgb(38, 38, 38);
    box-shadow: var(--elevated-shadow);
    color: rgb(205, 205, 205);
    border: 1px solid rgb(22, 22, 22);
    border-radius: 8px !important;
    left: 50%;
    top: 50%;
    padding: 8px;
    transform: translate(-50%, -80%);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    h2 {
        margin-top: 0;
        font-size: 1em;
        font-weight: normal;
    }
    input {
        width: 100%;
        border-radius: 5px;
        border-color: rgb(33, 33, 33);
        background: rgb(45, 45, 45);
        color: rgb(230, 230, 230);
    }
  }
</style>
