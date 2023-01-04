import autoBind from 'auto-bind';
import type { Observable } from 'rxjs';

import type { App } from '@mr/stores';

import { randint, waitFor } from '../utility';

export class Window {
  position = {
    x: 0,
    y: 0,
  };
  width: number;
  height: number;
  zIndex: Observable<number>;
  currentTransform: string;
  isActive: Observable<boolean>;
  $el: HTMLElement;
  draggingEnabled = true;

  constructor(private readonly app: App) {
    autoBind(this);
    this.height = app.height;
    this.width = app.width;
    this.zIndex = app.zIndex;
    this.position = this.getRandomPosition();
  }

  public init(windowElement: HTMLElement) {
    this.$el = windowElement;
    this.app.windowEl = windowElement;
    this.app.isActive.subscribe(
      (isActive) => isActive && windowElement.focus()
    );
    this.app.isMinimized.subscribe(this.toggleMinimize);
    this.app.isFullScreen.subscribe(this.toggleMaximize);
  }

  public onClose() {
    this.app.close();
  }

  public onMaximize() {
    this.app.isFullScreen.update((val) => !val);
  }

  public onMinimize() {
    this.app.isMinimized.update((val) => !val);
  }

  public onFocus() {
    this.app.setActive();
  }

  public onBlur() {
    this.app.setInactive();
  }

  public onDragStart() {
    this.app.setActive();
    this.app.setIsDragged(true);
  }

  public onDragEnd() {
    this.app.setIsDragged(false);
  }

  private _isMaximized = null;
  private async toggleMaximize(maximize: boolean) {
    if (this._isMaximized === null) {
      this._isMaximized = maximize;
      return;
    }
    if (!this.$el) return;
    this.$el.style.transition =
      'height 0.3s ease, width 0.3s ease, transform 0.3s ease';
    if (maximize) {
      this.draggingEnabled = false;
      this.currentTransform = this.$el.style.transform;
      this.$el.style.transform = `translate(0px, 0px)`;
      this.$el.style.width = `100%`;
      this.$el.style.height = 'calc(100vh - 24px)';
    } else {
      this.draggingEnabled = true;
      this.$el.style.transform = this.currentTransform;
      this.$el.style.width = `${+this.width}px`;
      this.$el.style.height = `${+this.height}px`;
    }
    await waitFor(300);
    this.$el.style.transition = '';
  }

  private _isMinimized = null;
  private async toggleMinimize(minimize: boolean) {
    if (this._isMinimized === null) {
      this._isMinimized = minimize;
      return;
    }
    if (!this.$el) return;
    this.$el.style.transition =
      'height 0.3s ease, width 0.3s ease, transform 0.3s ease, opacity 0.3s ease';
    if (minimize) {
      this.draggingEnabled = false;
      this.currentTransform = this.$el.style.transform;
      this.$el.style.transform = `translate(50%, 0vh)`;
      this.$el.style.width = `0%`;
      this.$el.style.height = '0';
      this.$el.style.opacity = '0';
    } else {
      this.draggingEnabled = true;
      this.$el.style.transform = this.currentTransform;
      this.$el.style.width = `${+this.width}px`;
      this.$el.style.height = `${+this.height}px`;
      this.$el.style.opacity = '1';
    }
    await waitFor(300);
    this.$el.style.transition = '';
  }

  private getRandomPosition() {
    const randX = randint(-600, 600);
    const randY = randint(-100, 100);
    return {
      x: (document.body.clientWidth / 2 + randX) / 2,
      y: (100 + randY) / 2,
    };
  }
}
