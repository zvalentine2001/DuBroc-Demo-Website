/* ============================================================
   DuBroc Demo & Construction — Main JS
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // Set current year in footer
  // ============================================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ============================================================
  // Sticky nav — scroll effect
  // ============================================================
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  // ============================================================
  // Mobile nav toggle
  // ============================================================
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen.toString());
      navMobile.setAttribute('aria-hidden', (!isOpen).toString());
    });

    // Close on link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
      }
    });
  }


  // ============================================================
  // Smooth scroll for anchor links (offset for fixed nav)
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ============================================================
  // Scroll-triggered fade-up animations (IntersectionObserver)
  // ============================================================
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }


  // ============================================================
  // Quote form — basic validation & submission handler
  // NOTE: Connect to your form backend here (GHL, Formspree, etc.)
  // ============================================================
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name');
      const phone = form.querySelector('#phone');
      const submitBtn = form.querySelector('[type="submit"]');
      let valid = true;

      // Simple required field check
      [name, phone].forEach(field => {
        if (!field || !field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Show loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending&hellip;';
      submitBtn.disabled = true;

      /*
        TODO: Replace this timeout with your actual form handler.
        Options:
          - GHL webhook: fetch('YOUR_GHL_WEBHOOK_URL', { method: 'POST', body: new FormData(form) })
          - Formspree: set form action="https://formspree.io/f/YOUR_ID" method="POST"
          - EmailJS, Netlify Forms, etc.
      */
      setTimeout(() => {
        submitBtn.innerHTML = 'Quote Request Sent!';
        submitBtn.style.background = '#16a34a';
        submitBtn.style.borderColor = '#16a34a';
        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 4000);
      }, 1200);
    });

    // Reset field error style on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

});

// ============================================================
// Animated stat counters (IntersectionObserver)
// ============================================================
(function() {
  var counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length || !('IntersectionObserver' in window)) {
    counters.forEach(function(el) { el.textContent = el.dataset.target; });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.target, 10);
      var duration = 1800;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) { requestAnimationFrame(step); }
        else { el.textContent = target; }
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(function(el) { observer.observe(el); });
})();


// ============================================================
// Before/After drag slider
// ============================================================
document.querySelectorAll('.ba-slider').forEach(function(slider) {
  var before = slider.querySelector('.ba-slider__img--before');
  var handle = slider.querySelector('.ba-slider__handle');
  var isDragging = false;

  function setPos(clientX) {
    var rect = slider.getBoundingClientRect();
    var pct = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 2), 98);
    before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
    slider.classList.add('dragged');
  }

  // Mouse
  slider.addEventListener('mousedown', function(e) {
    isDragging = true;
    setPos(e.clientX);
    e.preventDefault();
  });
  document.addEventListener('mousemove', function(e) {
    if (isDragging) setPos(e.clientX);
  });
  document.addEventListener('mouseup', function() { isDragging = false; });

  // Touch
  slider.addEventListener('touchstart', function(e) {
    isDragging = true;
    setPos(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if (isDragging) setPos(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchend', function() { isDragging = false; });
});


// ============================================================
// Sticky mobile CTA bar (injected on all pages)
// ============================================================
(function() {
  var bar = document.createElement('div');
  bar.className = 'mobile-cta-bar';
  bar.setAttribute('aria-label', 'Quick contact');
  bar.innerHTML =
    '<a href="tel:+14053632820" class="mobile-cta-bar__btn mobile-cta-bar__btn--call">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
      'Call Now' +
    '</a>' +
    '<a href="/get-a-quote.html" class="mobile-cta-bar__btn mobile-cta-bar__btn--quote">Get Free Quote</a>';
  document.body.appendChild(bar);

  var footer = document.querySelector('.footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      bar.classList.toggle('hidden', entries[0].isIntersecting);
    }, { threshold: 0.05 }).observe(footer);
  }
})();


// ============================================================
// Hero parallax on scroll
// ============================================================
(function() {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight * 1.2) {
        hero.style.backgroundPositionY = 'calc(45% + ' + Math.round(scrolled * 0.22) + 'px)';
      }
      ticking = false;
    });
  }, { passive: true });
})();


// ============================================================
// FAQ Accordion — event delegation (works on all pages)
// ============================================================
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.faq-question');
  if (!btn) return;
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  // Close all open items
  document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
    openItem.classList.remove('open');
    openItem.querySelector('.faq-answer').style.height = '0';
  });

  // Open clicked item if it was closed
  if (!isOpen) {
    item.classList.add('open');
    answer.style.height = answer.scrollHeight + 'px';
  }
});
