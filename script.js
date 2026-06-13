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
