/* Surface Talent — scroll-triggered animations
   Vanilla JS. No dependencies. Uses IntersectionObserver.
   Elements with [data-animate] fade/slide in when they enter the viewport.
   Optional: data-animate-delay="100" for stagger (ms).
   ──────────────────────────────────────────────────── */

(function () {
  'use strict';

  // Bail if no IntersectionObserver (old browsers get static page — fine)
  if (!('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  // Set initial hidden state immediately (avoids flash of unstyled content)
  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;
      var delay = parseInt(el.getAttribute('data-animate-delay') || '0', 10);

      setTimeout(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
