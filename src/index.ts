import { MINUTE } from '@beenotung/tslib/time';
import { format_time_duration } from '@beenotung/tslib/format';

let unit = MINUTE;
let unit_text = 'minute';
let interval = 10 * unit;
let interval_text = `${interval / unit} ${unit_text}s`;
let timer;

export let dom = {
  container: document.querySelector('#container') as HTMLDivElement,
  interval: document.querySelector('#interval') as HTMLSpanElement,
  change: document.querySelector('#change') as HTMLButtonElement,
  start: document.querySelector('#start') as HTMLSpanElement,
  end: document.querySelector('#end') as HTMLSpanElement,
  progress: document.querySelector('#progress') as HTMLProgressElement,
  left: document.querySelector('#left') as HTMLSpanElement,
};
// dom.container.style.display = 'initial';

function initDom() {
  interval_text = `${interval / unit} ${unit_text}s`;
  dom.interval.innerText = interval_text;
  dom.progress.max = interval;
}

initDom();
dom.change.onclick = e => {
  let answer = prompt('interval in unit of minute', interval / MINUTE);
  if (!answer) {
    return;
  }
  interval = +answer * MINUTE;
  initDom();
  init();
};

let start: number;
let end: number;

function init() {
  start = Date.now();
  end = start + interval;
  dom.start.innerText = new Date(start).toLocaleTimeString();
  dom.end.innerText = new Date(end).toLocaleTimeString();
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(loop, interval);
}

init();

function update(time: number) {
  let now = Date.now();
  let passed = now - start;
  let left = end - now;
  dom.progress.value = passed;
  dom.left.innerText = format_time_duration(left);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

function loop() {
  let now = Date.now();
  if (now < end) {
    let left = end - now;
    timer = setTimeout(loop, left);
    return;
  }
  alert(`${interval_text} has passed. What have you done?`);
  let answer = prompt('continue?', 'yes');
  if (answer) {
    init();
  }
}

