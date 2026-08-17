/* S&N Wedding Invitation — stable interaction build */
(() => {
  'use strict';

  const gate = document.getElementById('gate');
  const openButton = document.getElementById('openInvitation');
  const site = document.getElementById('site');
  const langButton = document.getElementById('langToggle');
  const faAudio = document.getElementById('faAudio');
  const enAudio = document.getElementById('enAudio');
  const rsvpModal = document.getElementById('rsvpModal');
  const rsvpForm = document.getElementById('rsvpForm');

  if (!gate || !openButton || !site || !langButton || !faAudio || !enAudio) return;

  const tracks = { fa: faAudio, en: enAudio };
  const storedLang = (() => { try { return sessionStorage.getItem('snWeddingLang'); } catch (_) { return null; } })();
  let lang = storedLang === 'en' ? 'en' : 'fa';
  let opened = false;
  let viewCount = 'Unavailable';

  function setLanguage(next) {
    lang = next === 'en' ? 'en' : 'fa';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-fa][data-en]').forEach(el => { el.innerHTML = lang === 'fa' ? el.dataset.fa : el.dataset.en; });
    langButton.textContent = lang === 'fa' ? 'English' : 'فارسی';
    document.title = lang === 'fa' ? 'سعید و نیلوفر | ۱۰ شهریور ۱۴۰۵' : 'Saeed & Niloufar | 31 August 2026';
    const formLanguage = document.getElementById('formLanguage');
    if (formLanguage) formLanguage.value = lang === 'fa' ? 'Persian' : 'English';
  }

  function stopAudio() { Object.values(tracks).forEach(audio => { audio.pause(); try { audio.currentTime = 0; } catch (_) {} }); }
  function playLanguageTrack() {
    const audio = tracks[lang];
    const other = lang === 'fa' ? tracks.en : tracks.fa;
    other.pause(); try { other.currentTime = 0; } catch (_) {}
    audio.currentTime = 0;
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  }
  function lockGate() {
    opened = false; stopAudio(); document.body.classList.add('gate-open'); site.classList.add('locked');
    gate.classList.remove('split', 'opened'); gate.setAttribute('aria-hidden', 'false'); window.scrollTo(0, 0);
  }
  function openInvitation() {
    if (opened) return;
    opened = true; playLanguageTrack(); document.body.classList.add('gate-open'); site.classList.remove('locked'); gate.classList.add('split');
    window.setTimeout(() => { gate.classList.add('opened'); gate.setAttribute('aria-hidden', 'true'); document.body.classList.remove('gate-open'); window.scrollTo(0, 0); document.querySelector('.hero')?.classList.add('visible'); }, 2700);
  }

  langButton.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); const next = lang === 'fa' ? 'en' : 'fa'; try { sessionStorage.setItem('snWeddingLang', next); } catch (_) {} window.location.reload(); });
  openButton.addEventListener('click', openInvitation, { passive: true });

  const fingerprintButton = document.getElementById('openInvitation');
  const fingerprintGate = document.getElementById('gate');
  if (fingerprintButton && fingerprintGate && !fingerprintButton.querySelector('.gate-fingerprint-safe')) {
    const stage = document.createElement('div'); stage.className = 'gate-fingerprint-safe'; stage.setAttribute('aria-hidden', 'true');
    const left = document.createElement('div'); const right = document.createElement('div'); left.className = 'gate-fp-half gate-fp-left'; right.className = 'gate-fp-half gate-fp-right';
    const leftImg = document.createElement('img'); const rightImg = document.createElement('img');
    leftImg.src = 'fingerprint-seal.png'; rightImg.src = 'fingerprint-seal.png'; leftImg.alt = ''; rightImg.alt = '';
    left.appendChild(leftImg); right.appendChild(rightImg); stage.append(left, right); fingerprintButton.appendChild(stage);
    const syncFingerprint = () => stage.classList.toggle('split', fingerprintGate.classList.contains('split'));
    new MutationObserver(syncFingerprint).observe(fingerprintGate, { attributes:true, attributeFilter:['class'] }); syncFingerprint();
  }
  openButton.onclick = openInvitation;
  setLanguage(lang); lockGate();

  function resolvePersianEventDate() {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-persian', { timeZone: 'Asia/Tehran', year: 'numeric', month: 'numeric', day: 'numeric' });
    const start = Date.UTC(2026, 0, 1, 12, 0, 0);
    for (let i = 0; i < 400; i++) {
      const d = new Date(start + i * 86400000); const parts = formatter.formatToParts(d);
      const y = Number(parts.find(p => p.type === 'year')?.value); const m = Number(parts.find(p => p.type === 'month')?.value); const day = Number(parts.find(p => p.type === 'day')?.value);
      if (y === 1405 && m === 6 && day === 10) return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
    }
    return '2026-08-31';
  }

  const eventDate = resolvePersianEventDate();
  const countdownTarget = new Date(`${eventDate}T19:00:00+03:30`).getTime();
  function updateCountdown() {
    let diff = Math.max(0, countdownTarget - Date.now()); const days = Math.floor(diff / 86400000); diff %= 86400000; const hours = Math.floor(diff / 3600000); diff %= 3600000; const minutes = Math.floor(diff / 60000); const seconds = Math.floor((diff % 60000) / 1000);
    Object.entries({ days, hours, minutes, seconds }).forEach(([id, value]) => { const el = document.getElementById(id); if (el) el.textContent = String(value).padStart(2, '0'); });
  }
  updateCountdown(); window.setInterval(updateCountdown, 1000);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

  // VINES: begin at the TOP of the first story image, stay parallel on both edges,
  // and reveal continuously to the true bottom. Both clip-path properties are
  // written explicitly for Safari/iPadOS.
  const vineScene = document.querySelector('.story-vines');
  const vineAssets = Array.from(document.querySelectorAll('.vine-asset'));
  if (vineScene && vineAssets.length) {
    let startRel = 0, endRel = 1, raf = 0;
    const docY = el => { const r = el.getBoundingClientRect(); return r.top + window.scrollY; };
    const layoutVines = () => {
      const firstPhoto = document.querySelector('.story-image.full-bleed');
      if (!firstPhoto) return;
      const siteTop = docY(site);
      const photoTop = docY(firstPhoto);
      const documentBottom = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      startRel = Math.max(0, photoTop - siteTop);
      endRel = Math.max(startRel + 1200, documentBottom - siteTop);
      vineScene.style.top = `${startRel}px`;
      vineScene.style.height = `${endRel - startRel}px`;
      vineScene.style.bottom = 'auto';
      vineAssets.forEach(asset => {
        const img = asset.querySelector('img');
        asset.style.clipPath = 'none';
        asset.style.webkitClipPath = 'none';
        if (img) { img.style.clipPath = 'inset(0 0 100% 0)'; img.style.webkitClipPath = 'inset(0 0 100% 0)'; }
      });
    };
    const updateVines = () => {
      raf = 0;
      const scrollRel = window.scrollY + window.innerHeight * 0.72 - docY(site);
      const progress = Math.max(0, Math.min(1, (scrollRel - startRel) / Math.max(1, endRel - startRel)));
      const bottom = `${((1 - progress) * 100).toFixed(2)}%`;
      vineAssets.forEach(asset => { const img = asset.querySelector('img'); if (!img) return; const clip = `inset(0 0 ${bottom} 0)`; img.style.clipPath = clip; img.style.webkitClipPath = clip; });
    };
    const requestVineUpdate = () => { if (!raf) raf = window.requestAnimationFrame(updateVines); };
    const refreshVines = () => { layoutVines(); updateVines(); };
    document.querySelectorAll('.gallery img, .story-image img, .venue-photo').forEach(img => { if (!img.complete) img.addEventListener('load', refreshVines, { once: true }); });
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(refreshVines); [site, document.querySelector('.gallery'), document.querySelector('.story-ending')].filter(Boolean).forEach(el => ro.observe(el)); }
    refreshVines(); window.addEventListener('load', refreshVines, { once: true }); window.addEventListener('resize', refreshVines, { passive: true }); window.addEventListener('orientationchange', refreshVines, { passive: true }); window.addEventListener('scroll', requestVineUpdate, { passive: true });
  }

  const rsvpOpen = document.getElementById('rsvpOpen'); const rsvpStatus = document.getElementById('rsvpStatus'); const visitTime = document.getElementById('visitTime'); const siteTotalViews = document.getElementById('siteTotalViews'); const formLanguage = document.getElementById('formLanguage');
  function tehranTime() { return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Tehran', hour12: false }) + ' (Tehran)'; }
  function openRsvp() { if (!rsvpModal) return; rsvpModal.classList.add('open'); rsvpModal.setAttribute('aria-hidden', 'false'); if (rsvpStatus) rsvpStatus.textContent = ''; if (visitTime) visitTime.value = tehranTime(); if (siteTotalViews) siteTotalViews.value = viewCount; document.querySelector("#rsvpForm input[name='name']")?.focus(); }
  function closeRsvp() { if (!rsvpModal) return; rsvpModal.classList.remove('open'); rsvpModal.setAttribute('aria-hidden', 'true'); }
  rsvpOpen?.addEventListener('click', openRsvp); document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeRsvp)); document.addEventListener('keydown', e => { if (e.key === 'Escape') closeRsvp(); });

  rsvpForm?.addEventListener('submit', async event => {
    event.preventDefault(); const submit = document.getElementById('submitRsvp'); if (submit) submit.disabled = true; if (rsvpStatus) rsvpStatus.textContent = lang === 'fa' ? 'در حال ارسال...' : 'Sending...'; if (visitTime) visitTime.value = tehranTime(); if (siteTotalViews) siteTotalViews.value = viewCount; if (formLanguage) formLanguage.value = lang === 'fa' ? 'Persian' : 'English';
    try {
      const response = await fetch('https://formsubmit.co/ajax/Saeed.sr72@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(rsvpForm).entries())) });
      const data = await response.json(); if (!response.ok || data.success === false) throw new Error('Submission failed'); if (rsvpStatus) rsvpStatus.textContent = lang === 'fa' ? 'پاسخ شما با موفقیت برای ما ارسال شد ❤️' : 'Your RSVP has been sent successfully ❤️'; rsvpForm.reset(); if (formLanguage) formLanguage.value = lang === 'fa' ? 'Persian' : 'English';
    } catch (_) { if (rsvpStatus) rsvpStatus.textContent = lang === 'fa' ? 'ارسال انجام نشد؛ لطفاً دوباره تلاش کنید.' : 'Something went wrong. Please try again.'; }
    finally { if (submit) submit.disabled = false; }
  });

  async function trackVisit() {
    const endpoint = 'https://api.counterapi.dev/v1/saeed-niloufar-wedding/site-views/up';
    try { const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' }); if (!response.ok) throw new Error(`Counter HTTP ${response.status}`); const result = await response.json(); const value = result?.value ?? result?.count ?? result?.data?.value ?? result?.data?.count; if (value !== undefined && value !== null) { viewCount = String(value); if (siteTotalViews) siteTotalViews.value = viewCount; } } catch (error) { console.warn('S&N view counter unavailable:', error); }
  }
  trackVisit();
})();
