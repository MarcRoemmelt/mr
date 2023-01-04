import { writable } from 'svelte-local-storage-store';

export type Colors = {
  [key: string]: {
    light: {
      hsl: string;
      contrastHsl: string;
    };
    dark: {
      hsl: string;
      contrastHsl: string;
    };
  };
};
export type Theme = {
  scheme: 'light' | 'dark';
  primaryColor: string;
};

export const theme = writable<Theme>('macos:theme-settings', {
  scheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  primaryColor: 'blue',
});

export const initTheme = (colors: Colors) => {
  theme.subscribe(({ scheme, primaryColor }) => {
    // Color scheme
    const { classList } = document.body;
    classList.remove('light', 'dark');
    classList.add(scheme);

    // Primary color
    // eslint-disable-next-line security/detect-object-injection
    const colorObj = colors[primaryColor][scheme];
    document.body.style.setProperty(
      '--system-color-primary',
      `hsl(${colorObj.hsl})`
    );
    document.body.style.setProperty(
      '--system-color-primary-hsl',
      `${colorObj.hsl}`
    );
    document.body.style.setProperty(
      '--system-color-primary-contrast',
      `hsl(${colorObj.contrastHsl})`
    );
    document.body.style.setProperty(
      '--system-color-primary-contrast-hsl',
      `${colorObj.contrastHsl}`
    );
  });
};
