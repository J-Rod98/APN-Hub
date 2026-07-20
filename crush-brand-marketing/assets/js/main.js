// Crush Brand Marketing — shared behavior
(function () {
  // current year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // nav scroll state + sticky mobile CTA
  var nav = document.getElementById('nav');
  var sticky = document.getElementById('stickyCta');
  var onScroll = function () {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (sticky) sticky.classList.toggle('show', y > 520);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion (smooth height with <details>)
  document.querySelectorAll('.faq').forEach(function (d) {
    var summary = d.querySelector('summary');
    var ans = d.querySelector('.ans');
    if (!summary || !ans) return;
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !d.open;
      document.querySelectorAll('.faq[open]').forEach(function (o) {
        if (o !== d) {
          o.open = false;
          var oa = o.querySelector('.ans');
          if (oa) oa.style.maxHeight = '0px';
        }
      });
      d.open = willOpen;
      ans.style.maxHeight = willOpen ? ans.scrollHeight + 'px' : '0px';
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq[open] .ans').forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  // reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
