/* S&N V7 FINAL FIX — additive only.
   Does not replace the working V6 RSVP, language, countdown or audio logic. */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     A. Fingerprint gate
     --------------------------------------------------------- */
  const gate = document.getElementById('gate');
  const button = document.getElementById('openInvitation');
  const emblem = button?.querySelector('.opening-emblem');

  if (gate && button && emblem && !button.querySelector('.gate-fingerprint-safe')) {
    const stage = document.createElement('div');
    stage.className = 'gate-fingerprint-safe';
    stage.setAttribute('aria-hidden', 'true');

    const left = document.createElement('div');
    left.className = 'gate-fp-half gate-fp-left';
    const right = document.createElement('div');
    right.className = 'gate-fp-half gate-fp-right';

    const leftImg = document.createElement('img');
    const rightImg = document.createElement('img');
    leftImg.src = 'fingerprint-seal.png';
    rightImg.src = 'fingerprint-seal.png';
    leftImg.alt = '';
    rightImg.alt = '';

    left.appendChild(leftImg);
    right.appendChild(rightImg);
    stage.append(left, right);
    button.insertBefore(stage, emblem);

    const syncFingerprint = () => {
      stage.classList.toggle('split', gate.classList.contains('split'));
    };

    const observer = new MutationObserver(syncFingerprint);
    observer.observe(gate, { attributes:true, attributeFilter:['class'] });
    syncFingerprint();
  }

  /* ---------------------------------------------------------
     B. Botanical vines
     --------------------------------------------------------- */
  const scene = document.querySelector('.story-vines');
  const leftVine = document.querySelector('.vine-left');
  const rightVine = document.querySelector('.vine-right');
  const gallery = document.querySelector('.gallery');
  const flower = document.querySelector('.vine-lotus');

  if (scene && leftVine && rightVine && gallery) {
    // Use the real lotus asset already supplied with the project.
    if (flower) flower.src = 'lotus-real-transparent.png';

    let startY = 0;
    let endY = 1;
    let raf = 0;

    const pageY = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const layout = () => {
      startY = Math.max(0, pageY(gallery));
      // The vines finish shortly after the final gallery image. This prevents
      // them from running through the countdown/RSVP and prevents empty tail space.
      endY = startY + gallery.offsetHeight + Math.min(560, Math.max(360, window.innerHeight * .72));
      scene.style.top = `${startY}px`;
      scene.style.height = `${Math.max(1, endY - startY)}px`;
    };

    const update = () => {
      raf = 0;
      const revealStart = startY - window.innerHeight * .08;
      const revealEnd = endY;
      const p = Math.max(0, Math.min(1, (window.scrollY + window.innerHeight * .70 - revealStart) / Math.max(1, revealEnd - revealStart)));

      // Slightly stagger the two sides so the convergence does not look mirrored.
      const lp = Math.max(0, Math.min(1, p * 1.035));
      const rp = Math.max(0, Math.min(1, p * 1.035 - .025));

      leftVine.style.clipPath = `inset(0 0 ${((1-lp)*100).toFixed(2)}% 0)`;
      rightVine.style.clipPath = `inset(0 0 ${((1-rp)*100).toFixed(2)}% 0)`;
      scene.classList.toggle('vines-finished', p >= .965);
    };

    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    const refresh = () => {
      layout();
      update();
    };

    refresh();
    window.addEventListener('load', refresh, { once:true });
    window.addEventListener('resize', refresh, { passive:true });
    window.addEventListener('scroll', requestUpdate, { passive:true });
  }
})();
