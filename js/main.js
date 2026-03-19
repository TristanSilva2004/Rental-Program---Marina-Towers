/* ============================================
   MARINA TOWERS — Global JS Utilities
   ============================================ */

// ── Navigation scroll effect ──────────────
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Mobile nav toggle ─────────────────────
(function initMobileNav() {
  const btn     = document.getElementById('navHamburger');
  const mobile  = document.getElementById('navMobile');
  if (!btn || !mobile) return;
  btn.addEventListener('click', () => {
    mobile.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    const isOpen = mobile.classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !mobile.contains(e.target)) {
      mobile.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
})();

// ── Active nav link ───────────────────────
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Utility helpers ───────────────────────
const Utils = {
  formatCurrency(amount) {
    return '$' + Number(amount).toLocaleString('en-US');
  },
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },
  formatDateTime(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },
  nightsBetween(from, to) {
    const a = new Date(from), b = new Date(to);
    return Math.max(0, Math.round((b - a) / (1000 * 60 * 60 * 24)));
  },
  escapeHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str || '')));
    return d.innerHTML;
  },
  getQueryParam(name) {
    return new URLSearchParams(location.search).get(name);
  },
  getListingById(id) {
    return DB.getListing(id);
  },
  showAlert(container, type, message) {
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    container.innerHTML = `
      <div class="alert alert-${type} fade-in">
        <span class="alert-icon">${icons[type] || '•'}</span>
        <span>${message}</span>
      </div>`;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
  // Scroll-reveal: add fade-up class when element enters viewport
  initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('fade-up');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => { el.style.opacity = '0'; obs.observe(el); });
  }
};

Utils.initScrollReveal();
