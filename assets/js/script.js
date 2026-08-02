document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const searchInput = document.getElementById('globalSearch');
  const searchBtn = document.getElementById('searchBtn');
  const searchFeedback = document.getElementById('searchFeedback');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  const page = document.body.dataset.page;
  if (page) {
    const activeLink = document.querySelector(`.nav-links a[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  function runSearch() {
    const term = (searchInput?.value || '').trim().toLowerCase();
    const cards = [...document.querySelectorAll('.searchable-card')];

    if (!cards.length) {
      if (searchFeedback) searchFeedback.textContent = '';
      return;
    }

    let visibleCount = 0;

    cards.forEach((card) => {
      const text = (card.dataset.search || card.textContent || '').toLowerCase();
      const isVisible = !term || text.includes(term);
      card.style.display = isVisible ? 'block' : 'none';
      if (isVisible) visibleCount += 1;
    });

    if (searchFeedback) {
      if (!term) {
        searchFeedback.textContent = '';
      } else {
        searchFeedback.textContent = `${visibleCount} result(s) found for "${term}".`;
      }
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', runSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runSearch();
      }
    });
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      item.classList.toggle('active');
      const icon = question.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-plus');
        icon.classList.toggle('fa-minus');
      }
    });
  });

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredFields = [
        { id: 'name', label: 'Name', pattern: /^.{2,}$/ },
        { id: 'email', label: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        { id: 'phone', label: 'Phone', pattern: /^[0-9+\-\s]{8,15}$/ },
        { id: 'message', label: 'Message', pattern: /^.{10,}$/ }
      ];

      requiredFields.forEach((field) => {
        const input = document.getElementById(field.id);
        const errorEl = document.querySelector(`[data-error="${field.id}"]`);

        if (!input || !errorEl) return;

        if (!field.pattern.test(input.value.trim())) {
          errorEl.textContent = `Please enter a valid ${field.label.toLowerCase()}.`;
          isValid = false;
        } else {
          errorEl.textContent = '';
        }
      });

      const status = document.getElementById('formStatus');
      if (status) {
        if (isValid) {
          status.style.color = 'var(--success)';
          status.textContent = 'Thank you. Your message has been submitted successfully.';
          contactForm.reset();
        } else {
          status.style.color = 'var(--danger)';
          status.textContent = 'Please correct the highlighted fields and try again.';
        }
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 280) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
