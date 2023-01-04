// eslint-disable-next-line max-lines-per-function
function worker() {
  const map = new Map<number, { time: number; timeout: number }>();

  const fn = (prevT: number, id: number, timeout = 1) => {
    const time = performance.now();
    const t = setTimeout(fn, timeout, time, id, timeout);
    map.set(id, { time, timeout: t });
    return t;
  };

  self.onmessage = function (msg: MessageEvent) {
    switch (msg.data.method) {
      case 'start': {
        map.set(msg.data.id, {
          time: 0,
          timeout: fn(performance.now(), msg.data.id),
        });
        break;
      }
      case 'end': {
        const timer = map.get(msg.data.id);
        map.delete(msg.data.id);
        clearTimeout(timer?.timeout);
        self.postMessage({
          method: 'end',
          id: msg.data.id,
          time: timer?.time ?? 0,
        });
        break;
      }
      default:
        return;
    }
  };
}
export default worker;
