/* S&N FINAL POLISH — mobile-safe fingerprint gate.
   Replaces only the SVG foreignObject rendering; the existing click/audio/split logic stays intact. */
(() => {
  const button = document.getElementById('openInvitation');
  const svg = button?.querySelector('.opening-emblem');
  if (!button || !svg) return;

  const wrap = document.createElement('div');
  wrap.className = 'gate-fingerprint-safe';
  wrap.setAttribute('aria-hidden', 'true');

  const left = document.createElement('div');
  left.className = 'gate-fp-half gate-fp-left';
  const right = document.createElement('div');
  right.className = 'gate-fp-half gate-fp-right';

  const a = document.createElement('img');
  const b = document.createElement('img');
  a.src = 'fingerprint-seal.png';
  b.src = 'fingerprint-seal.png';
  a.alt = '';
  b.alt = '';
  left.appendChild(a);
  right.appendChild(b);
  wrap.append(left, right);

  svg.style.display = 'none';
  button.insertBefore(wrap, button.querySelector('.gate-hint'));

  // Let the existing gate animation drive these two real HTML halves.
  const sync = () => {
    const split = document.getElementById('gate')?.classList.contains('split');
    wrap.classList.toggle('split', !!split);
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.getElementById('gate'), {attributes:true, attributeFilter:['class']});
  sync();
})();


/* S&N FINAL POLISH — vine timing only. Loaded after script.js. */
(() => {
  const scene = document.querySelector('.story-vines');
  const left = document.querySelector('.vine-left');
  const right = document.querySelector('.vine-right');
  const startEl = document.querySelector('.gallery');
  const endEl = document.querySelector('.closing');
  if (!scene || !left || !right || !startEl || !endEl) return;

  let startY = 0;
  let endY = 1;

  function pageY(el) {
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  }

  function layout() {
    startY = pageY(startEl);
    endY = Math.max(startY + 1, pageY(endEl) + endEl.offsetHeight);
    scene.style.top = `${startY}px`;
    scene.style.height = `${endY - startY}px`;
    scene.style.bottom = 'auto';
  }

  function update() {
    const y = window.scrollY + window.innerHeight * 0.72;
    const p = Math.max(0, Math.min(1, (y - startY) / (endY - startY)));

    // The two creepers reveal from the edges only after A FEW MOMENTS.
    const leftP = Math.max(0, Math.min(1, p * 1.08));
    const rightP = Math.max(0, Math.min(1, p * 1.08 - 0.025));

    left.style.clipPath = `inset(0 0 ${((1-leftP)*100).toFixed(2)}% 0)`;
    right.style.clipPath = `inset(0 0 ${((1-rightP)*100).toFixed(2)}% 0)`;

    scene.classList.toggle('vines-finished', p > 0.965);
  }

  function refresh() {
    layout();
    update();
  }

  refresh();
  window.addEventListener('load', refresh, {once:true});
  window.addEventListener('resize', refresh, {passive:true});
  window.addEventListener('scroll', update, {passive:true});
})();
