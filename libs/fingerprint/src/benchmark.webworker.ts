// eslint-disable-next-line max-lines-per-function
function worker() {
  self.onmessage = function () {
    expensive_sin();
    expensive_date();
    expensive_mul();
    postMessage('done');
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let x = 0;
  function expensive_mul() {
    for (let i = 0; i < 4000000000; i++) {
      x = i * 2;
    }
  }

  let z;
  function expensive_date() {
    for (let i = 0; i < 10000000; i++) {
      z = new Date();
      z = z.getTime();
    }
  }

  function expensive_sin() {
    let acc = 0;
    for (let i = 0; i < 40000000; i++) {
      i += 0.1;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      acc += Math.sin(i);
    }
  }
}
export default worker;
