(() => {
  const WA = '18684815741';
  const root = document.documentElement;
  root.classList.add('js');

  // Theme: light by default, dark only when chosen.
  const toggle = document.querySelector('.theme-toggle');
  const setTheme = (t) => {
    root.dataset.theme = t;
    toggle.innerHTML = t === 'dark' ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
    toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelector('meta[name="theme-color"]').content = t === 'dark' ? '#0B120D' : '#F3F5F0';
  };
  let saved = 'light';
  try { saved = localStorage.getItem('ttc-theme') || 'light'; } catch (e) {}
  setTheme(saved);
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('ttc-theme', next); } catch (e) {}
  });

  // Mobile menu
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  const closeMenu = () => {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<i class="ph ph-list"></i>';
  };
  burger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.innerHTML = open ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && closeMenu());

  // Soft reveal on enter
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Hide the floating WhatsApp button while the hero buttons, form or footer are on screen
  const fab = document.querySelector('.float-wa');
  if ('IntersectionObserver' in window) {
    const seen = new Set();
    const fo = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.isIntersecting ? seen.add(en.target) : seen.delete(en.target));
      fab.classList.toggle('hide', seen.size > 0);
    }, { threshold: 0.02 });
    document.querySelectorAll('.hero-ctas, .quote-panel, .footer').forEach((el) => fo.observe(el));
  }

  // Links that preselect a service in the form
  const form = document.getElementById('quote-form');
  document.querySelectorAll('a[data-service]').forEach((a) =>
    a.addEventListener('click', () => { form.elements.service.value = a.dataset.service; }));

  // Submit opens WhatsApp with the details filled in
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (n) => form.elements[n].value.trim();
    const check = (el, ok) => el.closest('.field').classList.toggle('invalid', !ok);
    check(form.elements.name, !!v('name'));
    check(form.elements.phone, v('phone').replace(/\D/g, '').length >= 7);
    const bad = form.querySelector('.field.invalid input');
    if (bad) { bad.focus(); return; }
    const lines = [
      'Hi Tropical Trees Control, I would like a quote.',
      `Name: ${v('name')}`,
      `Phone: ${v('phone')}`,
      `Service: ${v('service')}`,
      `Property: ${form.elements.property.value}`,
      v('area') && `Area: ${v('area')}`,
      v('details') && `About the job: ${v('details')}`,
    ];
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`, '_blank', 'noopener');
  });
  form.querySelectorAll('input').forEach((el) =>
    el.addEventListener('input', () => el.closest('.field') && el.closest('.field').classList.remove('invalid')));
})();
