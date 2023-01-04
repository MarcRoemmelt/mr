import { derived, get, Readable, writable } from 'svelte/store';
import type { ComponentType } from 'svelte';
import { BehaviorSubject } from 'rxjs';

export abstract class App<T = unknown> {
  abstract name: string;
  abstract componentLoader: () => Promise<{ default: ComponentType }>;
  abstract favoriteIconLoader?: () => Promise<{ default: ComponentType }>;

  constructor(private readonly store: AppStore) {
    this.isActive = derived(
      this.store.activeApp,
      ($activeApp) => $activeApp?.name === this.name
    );
  }

  private _component: ComponentType | null = null;
  get component() {
    if (this._component) return this._component;
    return this.componentLoader().then(
      (module) => (this._component = module.default)
    );
  }
  private _favoriteIcon: ComponentType | null = null;
  get favoriteIcon() {
    if (!this.favoriteIconLoader) return null;
    if (this._favoriteIcon) return this._favoriteIcon;
    return this.favoriteIconLoader().then(
      (module) => (this._favoriteIcon = module.default)
    );
  }

  width = 600;
  height = 500;
  isExpandable = false;
  isFavorite = false;
  hasDesktopIcon = false;
  windowEl: HTMLElement;
  zIndexSubject = new BehaviorSubject(0);
  zIndex = this.zIndexSubject.asObservable();
  isOpen = writable(false);
  isFullScreen = writable(false);
  isMinimized = writable(false);
  isDragged = writable(false);
  isActive: Readable<boolean>;

  open(file?: File<this, T>) {
    this.isOpen.set(true);
    this.isMinimized.set(false);
    this.store.appMap.update((appMap) => appMap);
    this.setActive();
    file && this.openFile(file);
  }
  close() {
    this.isOpen.update(() => false);
    this.isMinimized.set(false);
    this.isFullScreen.update(() => false);
    this.store.appMap.update((appMap) => appMap);
  }

  openFile(file: File<this, T>) {
    throw new Error(
      `openFile not implemented for ${this.constructor.name}. Received ${file.data}`
    );
  }

  setActive() {
    this.store.setActiveApp(this);
  }
  setInactive() {
    this.store.unsetActiveApp();
  }
  setZIndex(zIndex: number) {
    if (this.zIndexSubject.getValue() === zIndex) return;
    this.zIndexSubject.next(zIndex);
    this.store.appMap.update((appMap) => appMap);
  }
  setIsDragged(val: boolean) {
    if (get(this.isDragged) === val) return;
    this.isDragged.update(() => val);
  }
}

export abstract class File<A extends App<T> = App, T = unknown> {
  static appName: string;
  abstract name: string;
  abstract dataLoader: () => Promise<{ default: T }>;
  abstract iconLoader: () => Promise<{ default: ComponentType }>;

  constructor(public readonly app: A) {}

  private _icon: ComponentType | null = null;
  get icon() {
    if (this._icon) return this._icon;
    return this.iconLoader().then((module) => (this._icon = module.default));
  }

  private _data: T | null = null;
  get data() {
    if (this._data) return this._data;
    return this.dataLoader().then((module) => (this._data = module.default));
  }
  open() {
    this.app.open(this);
  }
}
class F<A extends App<T>, T> extends File<A, T> {
  name = 'Dummy class for type inference';
  dataLoader = () => Promise.reject<{ default: T }>('Missing implementation');
  iconLoader = () =>
    Promise.reject<{ default: ComponentType }>('Missing implementation');
}

export class AppStore {
  fileMap = writable<Map<string, File>>(new Map());
  fileList = derived(this.fileMap, (fileMap) => Array.from(fileMap.values()));
  appMap = writable<Map<string, App>>(new Map());
  appList = derived(this.appMap, (appMap) => Array.from(appMap.values()));
  openAppsList = derived(this.appList, ($appList) =>
    $appList.filter((app) => get(app.isOpen))
  );
  activeApp = writable<null | App>(null);
  private highestAppZIndex = derived(this.openAppsList, ($appList) =>
    Math.max(...$appList.map((app) => app.zIndexSubject.getValue()))
  );

  install<C extends new (store: AppStore) => App>(app: C) {
    this.appMap.update((apps) => new Map([...apps, [app.name, new app(this)]]));
  }
  registerFile<
    F extends typeof F<A, T>,
    T = unknown,
    A extends App<T> = App<T>
  >(file: F) {
    const app = get(this.appMap).get(file.appName);
    if (!app) {
      console.log('Failed to register file: ', file);
      return;
    }
    this.fileMap.update(
      (files) => new Map([...files, [file.name, new file(app as A)]])
    );
  }

  setActiveApp(app: App) {
    const currentActiveApp = get(this.activeApp);
    if (currentActiveApp?.name !== app.name) {
      const activeAppZIndex = get(this.highestAppZIndex) + 2;
      app.zIndexSubject.next(activeAppZIndex);
      this.activeApp.set(app);
      if (activeAppZIndex > 50) this.normalizeAppZIndices();
    }
  }

  private normalizeAppZIndices() {
    const appList = get(this.appList);
    const lowestZIndex = Math.min(
      ...[...new Set(appList)]
        .map(({ zIndexSubject }) => zIndexSubject.getValue())
        .filter((zIndex) => zIndex !== 0)
    );

    for (const app of appList) {
      const zIndex = app.zIndexSubject.getValue();
      if (zIndex >= lowestZIndex) {
        app.zIndexSubject.next(zIndex - lowestZIndex);
      }
    }
  }
  unsetActiveApp() {
    this.activeApp.set(null);
  }
}
export const appStore = new AppStore();
