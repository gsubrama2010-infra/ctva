/**
 * club-logo-hover.js
 * Pull-out popup + soft chime when hovering over a club logo card.
 * Uses event delegation on #logosGrid — no changes to index.html logic needed.
 */
(function () {

  /* ── POPUP ELEMENT ── */
  const popup = document.createElement('div');
  popup.id = 'clh-popup';
  Object.assign(popup.style, {
    position:        'fixed',
    zIndex:          '9999',
    background:      'rgba(11,20,16,0.97)',
    border:          '1px solid rgba(232,162,61,0.4)',
    borderRadius:    '14px',
    padding:         '1.2rem 1.4rem',
    textAlign:       'center',
    pointerEvents:   'none',
    opacity:         '0',
    transform:       'translateY(12px) scale(0.94)',
    transition:      'opacity 0.18s ease, transform 0.18s ease',
    boxShadow:       '0 14px 44px rgba(0,0,0,0.65)',
    width:           '170px',
    display:         'none',
  });
  document.body.appendChild(popup);

  /* ── SOUND: soft chime via Web Audio API (no file needed) ── */
  let audioCtx = null;
  function playChime() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc  = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      /* bright C6 → G5 slide, very short */
      osc.frequency.setValueAtTime(1047, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(784, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.22);
    } catch (_) {}
  }

  /* ── SHOW / HIDE ── */
  let hideTimer = null;
  let activeCard = null;

  function showPopup(card) {
    if (card === activeCard) return;
    activeCard = card;
    clearTimeout(hideTimer);

    const img      = card.querySelector('img');
    const fallback = card.querySelector('.logo-fallback');
    const name     = (card.querySelector('.logo-name') || {}).textContent || '';

    const mediaHtml = img
      ? `<img src="${img.src}" alt="${name}" style="width:96px;height:96px;object-fit:contain;display:block;margin:0 auto 0.55rem;">`
      : `<div style="width:72px;height:72px;border-radius:50%;background:#2F5233;display:flex;align-items:center;justify-content:center;font-size:1.35rem;font-weight:800;color:#FAF8F2;margin:0 auto 0.55rem;">${(fallback||{}).textContent||'?'}</div>`;

    popup.innerHTML = `
      ${mediaHtml}
      <div style="font-size:13px;font-weight:700;color:#FAF8F2;line-height:1.3;">${name}</div>
      <div style="font-size:10.5px;color:rgba(232,162,61,0.85);margin-top:5px;letter-spacing:0.07em;text-transform:uppercase;">Member Club</div>
    `;

    /* position above the card, flip below if near top of viewport */
    popup.style.display = 'block';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(12px) scale(0.94)';

    requestAnimationFrame(() => {
      const rect  = card.getBoundingClientRect();
      const popH  = popup.offsetHeight;
      const popW  = 170;
      let   left  = rect.left + rect.width / 2 - popW / 2;
      let   top   = rect.top - popH - 10;
      if (top < 8) top = rect.bottom + 10;
      left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));

      popup.style.left      = left + 'px';
      popup.style.top       = top  + 'px';
      popup.style.opacity   = '1';
      popup.style.transform = 'translateY(0) scale(1)';
    });

    playChime();
  }

  function hidePopup() {
    activeCard = null;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      popup.style.opacity   = '0';
      popup.style.transform = 'translateY(12px) scale(0.94)';
      hideTimer = setTimeout(() => { popup.style.display = 'none'; }, 180);
    }, 60);
  }

  /* ── WIRE UP VIA EVENT DELEGATION ── */
  window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('logosGrid');
    if (!grid) return;

    grid.addEventListener('mouseover', e => {
      const card = e.target.closest('.logo-card');
      if (card) showPopup(card);
    });

    grid.addEventListener('mouseout', e => {
      const to = e.relatedTarget;
      if (!to || !to.closest('.logo-card')) hidePopup();
    });
  });

})();
