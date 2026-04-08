/* ============================================
   KK DEV PORTFOLIO — SHARED JS
   Navigation, animations, utilities
   ============================================ */

// ── Cursor Glow ──
(function() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-glow';
  document.body.appendChild(cursor);
  let mx = -100, my = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  document.querySelectorAll('a, button, .btn, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '40px'; cursor.style.height = '40px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '18px'; cursor.style.height = '18px'; });
  });
})();

// ── Hamburger / Mobile Nav ──
(function() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
})();

// ── Scroll Progress Bar ──
(function() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  });
})();

// ── Reveal on Scroll (IntersectionObserver) ──
(function() {
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => observer.observe(t));
})();

// ── Active Nav Link ──
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── Footer Year ──
(function() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ── Ambient canvas helper (shared particle setup) ──
function AmbientCanvas(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const opts = Object.assign({
    count: 60,
    colors: ['rgba(168,85,247,0.5)', 'rgba(236,72,153,0.4)', 'rgba(249,115,22,0.3)'],
    maxSize: 3,
    speed: 0.4,
    connect: true,
    connectDist: 120
  }, options);

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * opts.speed * 2,
      vy: (Math.random() - 0.5) * opts.speed * 2,
      r: Math.random() * opts.maxSize + 1,
      color: opts.colors[Math.floor(Math.random() * opts.colors.length)]
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: opts.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      if (opts.connect) {
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < opts.connectDist) {
            const alpha = 1 - dist / opts.connectDist;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168,85,247,${alpha * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
}

// ── Toast Notification ──
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 30px; right: 30px; z-index: 99999;
    padding: 14px 24px; border-radius: 12px; font-weight: 600;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem;
    display: flex; align-items: center; gap: 10px;
    background: ${type === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)'};
    border: 1px solid ${type === 'success' ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)'};
    color: ${type === 'success' ? '#86EFAC' : '#FCA5A5'};
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toastIn 0.4s cubic-bezier(0.25,0.8,0.25,1);
  `;
  toast.innerHTML = `${type === 'success' ? '✓' : '✕'} ${message}`;
  document.body.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = `@keyframes toastIn { from { opacity:0; transform: translateX(30px); } to { opacity:1; transform: translateX(0); } }`;
  document.head.appendChild(style);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
