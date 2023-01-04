export class TimeProvider {
  started = false;
  myWorker: Worker;
  workerUrl: string;
  cbs = new Map<number, (time: number) => void>();

  async start() {
    //start the worker, if already started, do nothing
    if (this.started) return;
    this.started = true;
    const workerUrl = await this.getWorkerUrl();
    this.myWorker = new Worker(workerUrl);
    this.myWorker.onmessage = (e) => {
      if (!this.cbs.has(e.data.id)) return;
      const fn = this.cbs.get(e.data.id);
      fn(e.data.time);
      if (e.data.method === 'end') this.cbs.delete(e.data.id);
    };
  }
  startTimer(cb: (time: number) => void) {
    const id = Math.random();
    this.cbs.set(id, cb);
    this.myWorker.postMessage({ method: 'start', id });
    return id;
  }
  endTimer(id: number) {
    this.myWorker.postMessage({ method: 'end', id });
  }

  private async getWorkerUrl() {
    if (this.workerUrl) return this.workerUrl;
    const worker = await import('./time-provider.webworker');
    return URL.createObjectURL(
      new Blob(['(', worker.default.toString(), ')()'], {
        type: 'application/javascript',
      })
    );
  }
}
