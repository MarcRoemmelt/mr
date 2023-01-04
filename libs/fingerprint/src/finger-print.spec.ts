import { render, screen } from '@testing-library/svelte';

import { FingerPrintStore } from './finger-print.store';
import FingerPrint from './FingerPrint.svelte';

describe('FingerPrint App', () => {
  const store = new FingerPrintStore();
  it('Should render title', async () => {
    store.title = 'Test Title';
    render(FingerPrint, { store });
    const title = screen.queryByText(store.title);
    expect(title).not.toBeNull();
  });
  it('Should render description', async () => {
    store.description = 'Test Description';
    render(FingerPrint, { store });
    const description = screen.queryByText(store.description);
    expect(description).not.toBeNull();
  });
});
