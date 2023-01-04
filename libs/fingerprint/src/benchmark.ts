import type { TimeProvider } from './time-provider';

export class Benchmark {
  started = false;
  startTime = 0;
  myWorker: Worker;
  workerUrl: string;
  timerId: number;

  constructor(public readonly tc: TimeProvider) {}

  async start() {
    //start the worker, if already started, do nothing
    if (this.started) return;
    this.started = true;
    const workerUrl = await this.getWorkerUrl();

    this.myWorker = new Worker(workerUrl);
    this.myWorker.onmessage = () => {
      this.tc.endTimer(this.timerId);
    };
  }
  async bench(cb: (duration: number) => void) {
    this.timerId = this.tc.startTimer(cb);
    this.myWorker.postMessage('go');
  }

  private async getWorkerUrl() {
    if (this.workerUrl) return this.workerUrl;
    const worker = await import('./benchmark.webworker');
    return URL.createObjectURL(
      new Blob(['(', worker.default.toString(), ')()'], {
        type: 'application/javascript',
      })
    );
  }
}
