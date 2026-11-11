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

  // ---- Explore ribbons (mirrors /playground/explore) ----
  // Data ported from cinema8-admin-v2/src/app/modules/playground/explore/
  // data/fixtures.js (and avatarShowcase.js). Media URLs are public — same
  // CDN the real playground uses. Placeholder rows without a videoUrl /
  // imageUrl are skipped here; the admin paints a gradient for them but a
  // DEMO page should only advertise outputs the user can actually see.
  const S3 = 'https://s3.eu-central-1.wasabisys.com/gobito-genai/test/explore';
  const PROD = 'https://s3.eu-central-1.wasabisys.com/gobito-genai/product-studio/styles';
  const CDN = 'https://cdn1.cinema8.site/mp4s/100';

  const EXPLORE_CATEGORIES = [
    {
      // Ported from cinema8-admin-v2/.../motion-transfer/motionRecipes.js —
      // the ready recipes the Motion Transfer tool ships with. Each row's
      // preview mp4 is public and plays in place on hover.
      key: 'trending',
      title: 'Trending',
      gradient: ['#E91F54', '#FF8D10', '#A101FF'],
      items: [
        { id: 'golden-hour', title: 'Golden Hour', size: 'portrait', plays: 412000, videoUrl: `${S3}/reskin/recreate/1cf784d1bb0d45dd959672569422fe5c.mp4` },
        { id: 'parking-lot', title: 'Parking Lot', size: 'wide', plays: 384500, videoUrl: `${S3}/reskin/recreate/c3bbb65ad2b64ab28183edccbed8018a.mp4` },
        { id: 'hooded-crowd', title: 'Hooded Crowd', size: 'portrait', plays: 528000, videoUrl: `${S3}/reskin/recreate/8a53b2ea8ce5486fb97614a99438ec7e.mp4` },
        { id: 'studio-duet', title: 'Studio Duet', size: 'square', plays: 296000, videoUrl: `${S3}/reskin/recreate/f0e8dbb91d204fcc8d9a9157d4ff2121.mp4` },
        { id: 'neon-hologram', title: 'Neon Hologram', size: 'wide', plays: 471300, videoUrl: `${S3}/reskin/recreate/567f311bb025421f81dc8415685050c2.mp4` },
        { id: 'cliffside-reader', title: 'Cliffside Reader', size: 'square', plays: 215400, videoUrl: `${S3}/reskin/recreate/f72bab723b6843c89965045a3aadbaf2.mp4` },
        { id: 'knight-pitch', title: 'Knight Pitch', size: 'portrait', plays: 338200, videoUrl: `${S3}/reskin/recreate/dc131eb356744219ac1a8a0bccaa62b8.mp4` },
        { id: 'living-room', title: 'Living Room', size: 'portrait', plays: 142800, videoUrl: `${S3}/reskin/recreate/96e1c252a740483b83e2c15f6472354d.mp4` },
        { id: 'living-room-pitbull', title: 'Living Room · Pitbull', size: 'portrait', plays: 198700, videoUrl: `${S3}/reskin/recreate/living-room-pitbull.mp4` },
        { id: 'red-convertible-pitbull', title: 'Red Convertible · Pitbull', size: 'portrait', plays: 452100, videoUrl: `${S3}/reskin/recreate/3bc4f626c9414dae9d55b86b3a69d88a.mp4` },
        { id: 'giants-fence-cat-dog', title: 'Giants Fence · Cat & Dog', size: 'portrait', plays: 614500, videoUrl: `${S3}/reskin/recreate/giants-fence-cat-dog.mp4` },
        { id: 'nightclub-knights', title: 'Nightclub Knights', size: 'portrait', plays: 287600, videoUrl: `${S3}/reskin/recreate/nightclub-knights.mp4` },
        { id: 'fridge-warrior', title: 'Fridge Warrior', size: 'portrait', plays: 362900, videoUrl: `${S3}/reskin/recreate/fridge-warrior.mp4` },
        { id: 'locker-warrior', title: 'Locker Warrior', size: 'wide', plays: 243700, videoUrl: `${S3}/reskin/recreate/locker-warrior.mp4` },
        { id: 'club-pitbull', title: 'Club · Pitbull', size: 'portrait', plays: 405800, videoUrl: `${S3}/reskin/recreate/club-pitbull.mp4` },
        { id: 'window-lambo', title: 'Window Lambo', size: 'wide', plays: 176400, videoUrl: `${S3}/reskin/recreate/window-lambo.mp4` },
        { id: 'elevator-knights', title: 'Elevator Knights', size: 'wide', plays: 311200, videoUrl: `${S3}/reskin/recreate/elevator-knights.mp4` },
        { id: 'wedding-sweater', title: 'Wedding Sweater', size: 'portrait', plays: 129600, videoUrl: `${S3}/reskin/recreate/wedding-sweater.mp4` },
        { id: 'chatgbt-retriever', title: 'ChatGPT Retriever', size: 'portrait', plays: 498300, videoUrl: `${S3}/reskin/recreate/chatgbt-retriever.mp4` },
      ],
    },
    {
      key: 'seedance',
      title: 'Seedance 2.5',
      gradient: ['#F94F6F', '#A101FF'],
      items: [
        { id: 's-1', title: 'FER Phase 1', size: 'square', plays: 28300, videoUrl: `${S3}/seedance-2-5/fer_phase1.mp4` },
        { id: 's-2', title: 'Realface Auto', size: 'square', plays: 41800, videoUrl: `${S3}/seedance-2-5/realface_auto.mp4` },
        { id: 's-3', title: 'Yucel 21s', size: 'square', plays: 52400, videoUrl: `${S3}/seedance-2-5/yucel_21s.mp4` },
      ],
    },
    {
      key: 'avatar',
      title: 'Avatars',
      gradient: ['#427BFF', '#1600D5'],
      items: [
        { id: 'av-1', title: 'Gobi One — confident presenter', size: 'portrait', plays: 24300, videoUrl: `${CDN}/07GHT7woXGqyDn43Y06cSKN_FYW_96RcbABsxASLdx7Ka2nNpvu-W0zEW2a_96hU/media.mp4` },
        { id: 'av-2', title: 'Intellect — calm expert', size: 'portrait', plays: 9500000, videoUrl: `${CDN}/hRp4VeK7dq0Abi8M7yNRU-vStCUwgWCXm-3sGQdm4js4UIk-pfqYTTy3eBaxh5Ss/media.mp4` },
        { id: 'av-3', title: 'Sage — warm mentor', size: 'portrait', plays: 24600, videoUrl: `${CDN}/lQZIV2SeqGKd7Zl2Mwzx8yZACQbLzli5XVFxoXbOEOTLgFdPbd5YuspAtL94lXEn/media.mp4` },
        { id: 'av-4', title: 'Artist — expressive', size: 'portrait', plays: 106200, videoUrl: `${CDN}/Fe-gkj2FT8vppGTqthuQi-B6ebh3uBRcZK1Rx-pGT5Oj66q2I3x-lZWHYnaWjujY/media.mp4` },
        { id: 'av-5', title: 'Communicator — friendly host', size: 'portrait', plays: 29500, videoUrl: `${CDN}/SnEiBcYvxYV_R71rAQR4RC9FYp3WV10vWj3j1NvtTvAtWnzpq4Q7Z2ziSx1y5iMO/media.mp4` },
        { id: 'av-6', title: 'Gobi Two — bold delivery', size: 'portrait', plays: 18200, videoUrl: `${CDN}/QD2S9Gaz4klffvp-4SQAyRnaBbnfpOgz1L0tYCuL2oKAf6e3-vMkipLdnD1R8iof/media.mp4` },
      ],
    },
    {
      // Mirror of Trending: every entry is a Motion Transfer result, so
      // the same recipe library belongs here too. The three faceswap/
      // compare clips open the row since they predate the recipe set.
      key: 'motions',
      title: 'Motions',
      gradient: ['#A780FF', '#5B0180'],
      items: [
        { id: 'm-0', title: 'Compare Triplet', size: 'tall', plays: 287000, downloads: 3400, videoUrl: `${S3}/motions/compare_triplet.mp4` },
        { id: 'm-01', title: 'Faceswap Source', size: 'wide', plays: 94200, videoUrl: `${S3}/motions/faceswap_source.mp4` },
        { id: 'm-02', title: 'Faceswap Output', size: 'wide', plays: 128700, downloads: 2100, videoUrl: `${S3}/motions/faceswap_output.mp4` },
        { id: 'r-golden-hour', title: 'Golden Hour', size: 'portrait', plays: 412000, videoUrl: `${S3}/reskin/recreate/1cf784d1bb0d45dd959672569422fe5c.mp4` },
        { id: 'r-parking-lot', title: 'Parking Lot', size: 'wide', plays: 384500, videoUrl: `${S3}/reskin/recreate/c3bbb65ad2b64ab28183edccbed8018a.mp4` },
        { id: 'r-hooded-crowd', title: 'Hooded Crowd', size: 'portrait', plays: 528000, videoUrl: `${S3}/reskin/recreate/8a53b2ea8ce5486fb97614a99438ec7e.mp4` },
        { id: 'r-studio-duet', title: 'Studio Duet', size: 'square', plays: 296000, videoUrl: `${S3}/reskin/recreate/f0e8dbb91d204fcc8d9a9157d4ff2121.mp4` },
        { id: 'r-neon-hologram', title: 'Neon Hologram', size: 'wide', plays: 471300, videoUrl: `${S3}/reskin/recreate/567f311bb025421f81dc8415685050c2.mp4` },
        { id: 'r-cliffside-reader', title: 'Cliffside Reader', size: 'square', plays: 215400, videoUrl: `${S3}/reskin/recreate/f72bab723b6843c89965045a3aadbaf2.mp4` },
        { id: 'r-knight-pitch', title: 'Knight Pitch', size: 'portrait', plays: 338200, videoUrl: `${S3}/reskin/recreate/dc131eb356744219ac1a8a0bccaa62b8.mp4` },
        { id: 'r-living-room', title: 'Living Room', size: 'portrait', plays: 142800, videoUrl: `${S3}/reskin/recreate/96e1c252a740483b83e2c15f6472354d.mp4` },
        { id: 'r-living-room-pitbull', title: 'Living Room · Pitbull', size: 'portrait', plays: 198700, videoUrl: `${S3}/reskin/recreate/living-room-pitbull.mp4` },
        { id: 'r-red-convertible-pitbull', title: 'Red Convertible · Pitbull', size: 'portrait', plays: 452100, videoUrl: `${S3}/reskin/recreate/3bc4f626c9414dae9d55b86b3a69d88a.mp4` },
        { id: 'r-giants-fence-cat-dog', title: 'Giants Fence · Cat & Dog', size: 'portrait', plays: 614500, videoUrl: `${S3}/reskin/recreate/giants-fence-cat-dog.mp4` },
        { id: 'r-nightclub-knights', title: 'Nightclub Knights', size: 'portrait', plays: 287600, videoUrl: `${S3}/reskin/recreate/nightclub-knights.mp4` },
        { id: 'r-fridge-warrior', title: 'Fridge Warrior', size: 'portrait', plays: 362900, videoUrl: `${S3}/reskin/recreate/fridge-warrior.mp4` },
        { id: 'r-locker-warrior', title: 'Locker Warrior', size: 'wide', plays: 243700, videoUrl: `${S3}/reskin/recreate/locker-warrior.mp4` },
        { id: 'r-club-pitbull', title: 'Club · Pitbull', size: 'portrait', plays: 405800, videoUrl: `${S3}/reskin/recreate/club-pitbull.mp4` },
        { id: 'r-window-lambo', title: 'Window Lambo', size: 'wide', plays: 176400, videoUrl: `${S3}/reskin/recreate/window-lambo.mp4` },
        { id: 'r-elevator-knights', title: 'Elevator Knights', size: 'wide', plays: 311200, videoUrl: `${S3}/reskin/recreate/elevator-knights.mp4` },
        { id: 'r-wedding-sweater', title: 'Wedding Sweater', size: 'portrait', plays: 129600, videoUrl: `${S3}/reskin/recreate/wedding-sweater.mp4` },
        { id: 'r-chatgbt-retriever', title: 'ChatGPT Retriever', size: 'portrait', plays: 498300, videoUrl: `${S3}/reskin/recreate/chatgbt-retriever.mp4` },
      ],
    },
    {
      key: 'gptImage2',
      title: 'GPT Image 2',
      gradient: ['#28B851', '#1900FA'],
      items: [
        { id: 'g-heirloom', title: 'Heirloom · Ceramics Hero', size: 'wide', plays: 48200, imageUrl: `${S3}/gpt-image-2/heirloom_ceramics.png` },
        { id: 'g-nordura', title: 'Nordura · %30 İndirim', size: 'square', plays: 72400, imageUrl: `${S3}/gpt-image-2/nordura_turkish_sale.png` },
        { id: 'g-offhours', title: 'Off Hours · Drop 02', size: 'tall', plays: 61300, imageUrl: `${S3}/gpt-image-2/off_hours_streetwear.png` },
        { id: 'g-pulse', title: 'Pulse X Pro', size: 'wide', plays: 55800, imageUrl: `${S3}/gpt-image-2/pulse_x_pro_tech.png` },
        { id: 'g-form', title: 'FORM · Issue 03', size: 'tall', plays: 39700, imageUrl: `${S3}/gpt-image-2/form_magazine.png` },
        { id: 'g-atlas', title: 'Atlas Koleji · Erken Kayıt', size: 'square', plays: 83400, imageUrl: `${S3}/gpt-image-2/atlas_koleji.png` },
        { id: 'g-terra', title: 'Terra Residences', size: 'wide', plays: 67100, imageUrl: `${S3}/gpt-image-2/terra_residences.png` },
        { id: 'g-aura', title: 'Aura Coffee · Ethiopia Reserve', size: 'wide', plays: 51900, imageUrl: `${S3}/gpt-image-2/aura_coffee.png` },
        { id: 'g-flowbase', title: 'Flowbase 2026', size: 'wide', plays: 46200, imageUrl: `${S3}/gpt-image-2/flowbase_saas.png` },
        { id: 'g-vera', title: 'Vera Beauty · Glow Serum', size: 'tall', plays: 42800, imageUrl: `${S3}/gpt-image-2/vera_beauty.png` },
      ],
    },
    {
      key: 'marketingStudio',
      title: 'Marketing Studio',
      gradient: ['#FF8D10', '#E91F54'],
      items: [
        { id: 'mk-ugc-unboxing', title: 'UGC · Unboxing', size: 'tall', plays: 128400, videoUrl: `${PROD}/ugc_unboxing_example.mp4` },
        { id: 'mk-ugc-tutorial', title: 'UGC · Tutorial', size: 'tall', plays: 95700, videoUrl: `${PROD}/ugc_tutorial_example.mp4` },
        { id: 'mk-ugc-review', title: 'UGC · Review', size: 'tall', plays: 82300, videoUrl: `${PROD}/ugc_review_example.mp4` },
        { id: 'mk-ugc-ba', title: 'UGC · Before / After', size: 'tall', plays: 107200, videoUrl: `${PROD}/ugc_before_after_example.mp4` },
        { id: 'mk-motion-hero', title: 'Motion · Hypermotion Hero', size: 'tall', plays: 141600, videoUrl: `${PROD}/hypermotion_hero_example.mp4` },
        { id: 'mk-motion-reveal', title: 'Motion · Bloom Reveal', size: 'tall', plays: 118900, videoUrl: `${PROD}/hypermotion_reveal_example.mp4` },
        { id: 'mk-motion-splash', title: 'Motion · Liquid Splash', size: 'tall', plays: 164500, videoUrl: `${PROD}/motion_liquid_splash_example.mp4` },
      ],
    },
  ];

  const formatCount = (n) => {
    if (n == null) return '';
    if (n >= 1e6) return (n / 1e6).toFixed(n < 1e7 ? 1 : 0).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return String(n);
  };

  const renderExploreRow = (cat) => {
    const grad = cat.gradient.join(', ');
    const cards = cat.items.map((item) => {
      const sizeCls = 'ex-' + (item.size || 'tall');
      let mediaHtml = '';
      let dataAttrs = '';
      if (item.videoUrl) {
        dataAttrs = ` data-video="${item.videoUrl}"`;
        mediaHtml = '<video class="ex-media" muted loop playsinline preload="none"></video>';
      } else if (item.imageUrl) {
        mediaHtml = `<img class="ex-media" src="${item.imageUrl}" alt="${item.title}" loading="lazy">`;
      }
      const plays = item.plays != null ? `<span class="ex-plays">▶ ${formatCount(item.plays)}</span>` : '';
      const dls = item.downloads != null ? `<span class="ex-dl">⬇ ${formatCount(item.downloads)}</span>` : '';
      return `
        <article class="ex-card ${sizeCls}"${dataAttrs}>
          ${mediaHtml}
          <span class="ex-title">${item.title}</span>
          ${plays}${dls}
        </article>`;
    }).join('');

    return `
      <section class="explore-row">
        <header class="explore-head">
          <h2 class="explore-title" style="background-image: linear-gradient(90deg, ${grad});">${cat.title}</h2>
          <div class="explore-arrows">
            <button class="explore-arrow" data-dir="-1" aria-label="Scroll left">‹</button>
            <button class="explore-arrow" data-dir="1" aria-label="Scroll right">›</button>
          </div>
        </header>
        <div class="explore-track">${cards}</div>
      </section>`;
  };

  const exploreRoot = document.getElementById('explore-root');
  if (exploreRoot) {
    exploreRoot.innerHTML = EXPLORE_CATEGORIES.map(renderExploreRow).join('');

    // Wire arrow buttons
    exploreRoot.querySelectorAll('.explore-row').forEach((row) => {
      const track = row.querySelector('.explore-track');
      row.querySelectorAll('.explore-arrow').forEach((btn) => {
        btn.addEventListener('click', () => {
          const dir = Number(btn.dataset.dir) || 1;
          track.scrollBy({ left: dir * 420, behavior: 'smooth' });
        });
      });
    });

    // Hover-to-play + lazy poster for each card with a video
    exploreRoot.querySelectorAll('.ex-card[data-video]').forEach((card) => {
      const vid = card.querySelector('video');
      const src = card.dataset.video;
      const ensureSrc = () => { if (!vid.src) vid.src = src; };

      card.addEventListener('mouseenter', () => { ensureSrc(); vid.play().catch(() => {}); });
      card.addEventListener('mouseleave', () => { vid.pause(); try { vid.currentTime = 0; } catch (e) {} });

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { ensureSrc(); io.disconnect(); }
          });
        }, { rootMargin: '400px' });
        io.observe(card);
      } else {
        ensureSrc();
      }
    });
  }
})();
