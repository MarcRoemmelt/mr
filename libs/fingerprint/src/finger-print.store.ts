import { Benchmark } from './benchmark';
import { TimeProvider } from './time-provider';

export class FingerPrintStore {
  title: string;
  description: string;

  clientRectFingerprintKey = 'client-rect-fingerprint';
  getClientRectFingerprint(...rects: HTMLElement[]) {
    const localData = localStorage.getItem(this.clientRectFingerprintKey);
    const data = JSON.stringify(rects.map((rect) => rect.getClientRects()[0]));
    localStorage.setItem(this.clientRectFingerprintKey, data);
    console.log('ClientRect Fingerprint matches: ', localData === data);
  }
  getScrollFingerprint() {
    const deltas = [];
    const millis = [];
    let ts = performance.now();
    const listener = (e: WheelEvent) => {
      deltas.push(Math.max(e.deltaX, e.deltaY, e.deltaZ));
      const newTs = performance.now();
      millis.push(newTs - ts);
      ts = newTs;
    };
    window.addEventListener('wheel', listener);
    const conclude = () => {
      console.log('Scroll Fingerprint deltas: ', deltas);
      console.log('Scroll Fingerprint millis: ', millis);
      window.removeEventListener('wheel', listener);
    };
    setTimeout(conclude, 60000);
  }
  getMouseSpeedFingerprint() {
    let ts = performance.now();
    const millis = [];
    let biggestStep = 0;
    let prevX = 0;
    let prevY = 0;
    const listener = (e: MouseEvent) => {
      const dist = Math.max(
        Math.abs(e.pageX - prevX),
        Math.abs(e.pageY - prevY)
      );
      if (dist > biggestStep) {
        biggestStep = dist;
      }
      prevX = e.pageX;
      prevY = e.pageY;
      const newTs = performance.now();
      millis.push(newTs - ts);
      ts = newTs;
    };
    window.addEventListener('mousemove', listener);
    const conclude = () => {
      console.log('MouseSpeed Fingerprint biggestStep: ', biggestStep);
      console.log('MouseSpeed Fingerprint millis: ', millis);
      window.removeEventListener('wheel', listener);
    };
    setTimeout(conclude, 60000);
  }
  async getCpuBenchmarkFingerprint() {
    if (!URL.createObjectURL) return;
    const tp = new TimeProvider();
    const bench = new Benchmark(tp);
    await bench.start();
    await tp.start();
    bench.bench((benchmark) => {
      console.log('Benchmark: ', benchmark);
    });
  }
}
export const fingerPrintStore = new FingerPrintStore();
