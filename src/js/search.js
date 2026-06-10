export function initSearch({ inputEl, onChange, delay = 250 }) {
  const handler = debounce((value) => onChange(value), delay);

  inputEl.addEventListener("input", (event) => {
    handler(event.target.value);
  });
}

function debounce(fn, wait) {
  let timerId = null;

  return (value) => {
    if (timerId) window.clearTimeout(timerId);
    timerId = window.setTimeout(() => fn(value), wait);
  };
}

