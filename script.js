/**
 * MV Construtora — script.js
 * ─────────────────────────────────────────
 * 1. Navbar scroll
 * 2. Menu mobile (toggle correto, fecha ao clicar link/overlay/fora)
 * 3. Partículas do hero
 * 4. Animação de contadores
 * 5. Reveal on scroll (IntersectionObserver)
 * 6. Barras de progresso animadas
 * 7. Abas da galeria
 * 8. Formulário de contato
 * ─────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     1. NAVBAR SCROLL
  ══════════════════════════════════════ */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });


  /* ══════════════════════════════════════
     2. MENU MOBILE — toggle correto
  ══════════════════════════════════════ */
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('show');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // bloqueia scroll do body
  }

  function closeMenu() {
    menuOpen = false;
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('show');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Clique no hambúrguer abre/fecha
  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  // Botão X fecha
  mobileClose.addEventListener('click', closeMenu);

  // Overlay escurece fecha
  mobileOverlay.addEventListener('click', closeMenu);

  // Links do menu fecham ao clicar
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ESC fecha
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });


  /* ══════════════════════════════════════
     3. PARTÍCULAS DO HERO
  ══════════════════════════════════════ */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 5 + 2;
      p.style.cssText = [
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + Math.random() * 100 + '%',
        'animation-duration:'  + (Math.random() * 8 + 6) + 's',
        'animation-delay:'     + (Math.random() * 8)     + 's',
      ].join(';');
      container.appendChild(p);
    }
  }
  createParticles();


  /* ══════════════════════════════════════
     4. CONTADORES ANIMADOS
  ══════════════════════════════════════ */
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
      const target  = parseInt(el.dataset.target, 10);
      const suffix  = el.dataset.suffix || '+';
      let current   = 0;
      const increment = target / 60;

      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
      }, 25);
    });
  }

  // Dispara quando a seção de stats entra na viewport
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsEl);
  }


  /* ══════════════════════════════════════
     5. REVEAL ON SCROLL
  ══════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ══════════════════════════════════════
     6. BARRAS DE PROGRESSO
  ══════════════════════════════════════ */
  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.diff-bar-fill').forEach(function (bar) {
          // pequeno delay para a animação ser visível
          setTimeout(function () { bar.classList.add('animated'); }, 200);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.diff-cert').forEach(function (el) {
    barObserver.observe(el);
  });


  /* ══════════════════════════════════════
     7. ABAS DA GALERIA
  ══════════════════════════════════════ */
  document.querySelectorAll('.gtab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Remove active de todas as abas
      document.querySelectorAll('.gtab').forEach(function (t) {
        t.classList.remove('active');
      });

      // Esconde todos os grids
      document.querySelectorAll('.gallery-grid').forEach(function (g) {
        g.classList.add('hidden');
      });

      // Ativa aba e grid correspondente
      tab.classList.add('active');
      const targetId = 'tab-' + tab.dataset.tab;
      const targetGrid = document.getElementById(targetId);
      if (targetGrid) targetGrid.classList.remove('hidden');
    });
  });


  /* ══════════════════════════════════════
     8. FORMULÁRIO DE CONTATO
  ══════════════════════════════════════ */
  const mainForm = document.getElementById('mainForm');
  if (mainForm) {
    mainForm.addEventListener('submit', submitForm);
  }

  async function submitForm(e) {
    e.preventDefault();

    const nome      = document.getElementById('nome');
    const email     = document.getElementById('email');
    const telefone  = document.getElementById('telefone');
    const servico   = document.getElementById('servico');
    const mensagem  = document.getElementById('mensagem');

    // Validação básica
    if (!nome.value.trim()) {
      highlightField(nome); return;
    }
    if (!email.value.trim() || !email.value.includes('@')) {
      highlightField(email); return;
    }
    if (!telefone.value.trim()) {
      highlightField(telefone); return;
    }
    if (!servico.value) {
      highlightField(servico); return;
    }

    // Desabilitar botão
    const submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Preparar dados
    const formData = new FormData(mainForm);

    // Enviar
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        mainForm.style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      } else {
        throw new Error(result.message || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      mainForm.style.display = 'none';
      document.getElementById('formError').classList.add('show');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Receba Seu Orçamento Agora';
    }
  }

  function highlightField(el) {
    el.style.borderColor = '#E8001F';
    el.focus();
    el.addEventListener('input', function clearError() {
      el.style.borderColor = '';
      el.removeEventListener('input', clearError);
    });
  }

})();
