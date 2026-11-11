// Cinema8 AI demo — minimal interactivity.
// Mock-only: no API calls, no persistence. Clicks swap state; "Generate"
// shows a loader then a sample result from the showcase.

(function () {
  'use strict';

  // ---- Mode pills (home + tool pages) ----
  document.querySelectorAll('.mode-pills').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill');
      if (!btn) return;
      group.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');

      // On the home hero, swap the placeholder to match the mode.
      const input = document.getElementById('heroPrompt');
      if (input) {
        const examples = {
          'text-to-video': 'A cinematic drone shot flying over a neon-lit Istanbul rooftop at dusk, camera slowly pushing forward…',
          'image-to-video': 'Animate the attached photo — subtle parallax, camera pushing in, light breeze on the hair.',
          'motion-transfer': 'Keep the moves of the source video and rebuild it with the uploaded character images.',
          'avatar': 'Script the avatar will speak. 1-2 sentences work best.',
          'text-to-image': 'A sci-fi course cover: deep indigo nebula, holographic textbook floating, soft rim light.',
          'text-to-speech': 'Hello and welcome to this Cinema8 lesson. Today we will cover the basics of interactive video.',
        };
        input.placeholder = examples[btn.dataset.mode] || input.placeholder;
      }
    });
  });

  // ---- Category chips (home) ----
  const chips = document.getElementById('catChips');
  if (chips) {
    chips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.cat;
      document.querySelectorAll('[data-shelf]').forEach((shelf) => {
        shelf.style.display = (cat === 'all' || shelf.dataset.shelf === cat) ? '' : 'none';
      });
    });
  }

  // ---- Mock generate button ----
  const runMockGenerate = (triggerBtn) => {
    // Find the output panel in the same tool-page grid. For the home hero,
    // flash the button to simulate a submission — no output panel on home.
    const page = triggerBtn.closest('.tool-page');
    if (!page) {
      const original = triggerBtn.textContent;
      triggerBtn.disabled = true;
      triggerBtn.textContent = '⏳ Queued…';
      setTimeout(() => {
        triggerBtn.textContent = '✓ Sent to tool';
        setTimeout(() => {
          triggerBtn.textContent = original;
          triggerBtn.disabled = false;
        }, 1200);
      }, 900);
      return;
    }

    const empty = page.querySelector('.output-empty');
    const loading = page.querySelector('.output-loading');
    const result = page.querySelector('.output-result');
    if (!loading || !result) return;

    empty && (empty.style.display = 'none');
    result.style.display = 'none';
    loading.style.display = 'block';
    triggerBtn.disabled = true;

    setTimeout(() => {
      loading.style.display = 'none';
      result.style.display = 'block';
      triggerBtn.disabled = false;
    }, 2400);
  };

  document.querySelectorAll('[data-generate]').forEach((btn) => {
    btn.addEventListener('click', () => runMockGenerate(btn));
  });
  const heroBtn = document.getElementById('heroGenerate');
  if (heroBtn) heroBtn.addEventListener('click', () => runMockGenerate(heroBtn));

  // ---- Dropzone mock upload ----
  document.querySelectorAll('.dropzone').forEach((zone) => {
    zone.addEventListener('click', () => {
      const demo = zone.dataset.demo;
      if (!demo) return;
      zone.classList.add('has-media');
      zone.innerHTML = '<div class="thumb" style="background-image:' + demo + '"></div>';
    });
  });

  // ---- Scene chips (video studio) ----
  document.querySelectorAll('.timeline-track').forEach((track) => {
    track.addEventListener('click', (e) => {
      const chip = e.target.closest('.scene-chip');
      if (!chip) return;
      track.querySelectorAll('.scene-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // ---- Recipe cards (motion transfer) ----
  document.querySelectorAll('.recipe-card').forEach((card) => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt;
      const input = document.querySelector('.field textarea[data-prompt-target]');
      if (prompt && input) {
        input.value = prompt;
        input.focus();
      }
    });
  });
})();
