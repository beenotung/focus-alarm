import { MINUTE } from '@beenotung/tslib/time';
import { format_time_duration } from '@beenotung/tslib/format';

let unit = MINUTE;
let unit_text = 'minute';
let interval = (+localStorage.getItem('interval') || 10) * unit;
let interval_text = `${interval / unit} ${unit_text}s`;
let theme = localStorage.getItem('theme') || 'light';
let timer;

export let dom = {
  container: document.getElementById('container') as HTMLDivElement,
  interval: document.getElementById('interval') as HTMLSpanElement,
  changeInterval: document.getElementById('change-interval') as HTMLButtonElement,
  theme: document.getElementById('theme') as HTMLSpanElement,
  changeTheme: document.getElementById('change-theme') as HTMLButtonElement,
  start: document.getElementById('start') as HTMLSpanElement,
  end: document.getElementById('end') as HTMLSpanElement,
  progress: document.getElementById('progress') as HTMLProgressElement,
  left: document.getElementById('left') as HTMLSpanElement,
  style: document.createElement('style'),
};
document.head.appendChild(dom.style);

function renderTheme() {
  dom.theme.innerText = theme;
  if (theme === 'dark') {
    dom.changeTheme.innerText='Change to light'
    dom.style.innerHTML = `* {
  background: black !important;
  color: lightgreen !important;
}`
  } else {
    dom.changeTheme.innerText='Change to dark'
    dom.style.innerHTML=''
  }
}

renderTheme();

function renderInterval() {
  interval_text = `${interval / unit} ${unit_text}s`;
  dom.interval.innerText = interval_text;
  dom.progress.max = interval;
}

renderInterval();

dom.changeInterval.onclick = e => {
  let answer = prompt('interval in unit of minute', (interval / MINUTE).toString());
  if (!answer) {
    return;
  }
  localStorage.setItem('interval', answer);
  interval = +answer * MINUTE;
  renderInterval();
  init();
};

dom.changeTheme.onclick = e => {
  switch (theme) {
    case 'light':
      theme = 'dark';
      break;
    case 'dark':
      theme = 'light';
      break;
  }
  localStorage.setItem('theme', theme);
  dom.theme.innerText = theme;
  renderTheme();
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

