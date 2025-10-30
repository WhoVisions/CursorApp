'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status');
  const changeCursorBtn = document.getElementById('changeBtn');
  const tabs = Array.from(document.querySelectorAll('.nav-bottom .tab'));
  const themeToggle = document.getElementById('themeToggle');
  let isPointer = false;

  // Apply saved theme preference if present
  try {
    const savedTheme = localStorage.getItem('cursorapp:theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      document.body.setAttribute('data-theme', savedTheme);
    }
  } catch {}

  // create a small follower dot (skip for reduced motion)
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dot;
  if (!prefersReducedMotion) {
    dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    const render = () => {
      if (dot) {
        dot.style.left = targetX + 'px';
        dot.style.top = targetY + 'px';
      }
      rafId = null;
    };
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(render);
      }
    }, { passive: true });
  }

  // cursor change button
  if (changeCursorBtn && statusEl) {
    changeCursorBtn.addEventListener('click', () => {
      isPointer = !isPointer;
      document.body.style.cursor = isPointer ? 'crosshair' : 'default';
      statusEl.textContent = `Cursor: ${isPointer ? 'crosshair' : 'default'}`;
      changeCursorBtn.textContent = isPointer ? 'Reset cursor' : 'Change cursor';
    });
  }

  // bottom tab active state
  if (tabs.length > 0) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }

  // theme toggle with persistence
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      try { localStorage.setItem('cursorapp:theme', next); } catch {}
    });
  }
});
