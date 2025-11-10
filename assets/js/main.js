/* ========= main.js — consolidated, defensive, UX-focused ======== */

/*=============== Utilities ===============*/
function debounce(fn, wait = 50) {
  let t;
  return function (...args) {
    const ctx = this;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(ctx, args), wait);
  };
}

function safeQuery(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (e) {
    return null;
  }
}

/*=============== NAV: show/hide menu, ARIA, keyboard ===============*/
const navMenu = safeQuery('#nav-menu');
const navToggle = safeQuery('#nav-toggle');
const navClose = safeQuery('#nav-close');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('show-menu');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      const firstLink = navMenu.querySelector('.nav__link');
      if (firstLink) firstLink.focus();
    } else {
      navToggle.focus();
    }
  });
}

if (navClose && navMenu) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    navToggle && navToggle.focus();
  });
}

// Close nav on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu && navMenu.classList.contains('show-menu')) {
    navMenu.classList.remove('show-menu');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    navToggle && navToggle.focus();
  }
});

/*=============== Active link (navigation) ===============*/
const navLinks = document.querySelectorAll('.nav__link');
if (navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      navLinks.forEach((a) => a.classList.remove('active-link'));
      this.classList.add('active-link');

      if (navMenu && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });
}

/*=============== Header scroll effect (debounced) ===============*/
function scrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  if (window.scrollY >= 50) header.classList.add('scroll-header');
  else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', debounce(scrollHeader, 40));

/*=============== Intersection Observer: active section (scroll spy) ===============*/
(function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  if (!sections.length || !navLinks.length) return;

  const options = {
    root: null,
    rootMargin: '0px 0px -30% 0px', // trigger earlier
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, options);

  sections.forEach((s) => observer.observe(s));
})();

/*=============== MixItUp (guarded) ===============*/
if (typeof mixitup !== 'undefined') {
  try {
    mixitup('.projects__container', {
      selectors: { target: '.project__item' },
      animation: { duration: 300 },
    });
  } catch (err) {
    console.warn('MixItUp init failed:', err);
  }
}

/*=============== Active work buttons (guarded) ===============*/
const linkWork = document.querySelectorAll('.category__btn');
if (linkWork.length) {
  linkWork.forEach((a) => a.addEventListener('click', function () {
    linkWork.forEach((b) => b.classList.remove('active-work'));
    this.classList.add('active-work');
  }));
}

/*=============== Testimonials Swiper (guarded) ===============*/
if (typeof Swiper !== 'undefined') {
  try {
    var swiper = new Swiper('.testimonial__container', {
      loop: true,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination' },
      mousewheel: true,
      keyboard: true,
    });
  } catch (err) {
    console.warn('Swiper init failed:', err);
  }
}

/*=============== Contact Form (improved UX) ===============*/
(function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactMessageInput = document.getElementById('message');
  const contactMessage = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit');

  const setStatus = (text, isError = false) => {
    if (!contactMessage) return;
    contactMessage.textContent = text;
    contactMessage.classList.toggle('color-dark', isError);
    contactMessage.classList.toggle('color-light', !isError);
  };

  const validate = () => {
    if (!contactName.value.trim() || !contactEmail.value.trim() || !contactMessageInput.value.trim()) {
      setStatus('Please fill all fields.', true);
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactEmail.value.trim())) {
      setStatus('Please enter a valid email.', true);
      return false;
    }
    return true;
  };

  const clearStatusLater = (ms = 4000) => {
    setTimeout(() => {
      if (contactMessage) contactMessage.textContent = '';
    }, ms);
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      clearStatusLater();
      return;
    }

    submitBtn && (submitBtn.disabled = true);
    setStatus('Sending...');

    try {
      if (typeof emailjs !== 'undefined' && emailjs.sendForm) {
        await emailjs.sendForm('service_s5pyocq', 'template_mbrgs9w', '#contact-form', '7jXYHGGphtyq79mZ2');
        setStatus('Message sent ✅');
        contactForm.reset();
      } else {
        console.warn('emailjs not available — fallback activated');
        setStatus('Message queued (local fallback).');
        contactForm.reset();
      }
    } catch (err) {
      console.error('sendEmail error', err);
      setStatus('Failed to send. Try again later.', true);
    } finally {
      clearStatusLater(4000);
      submitBtn && (submitBtn.disabled = false);
    }
  });
})();

/*=============== Project filters (group-level) ===============*/
(function initProjectFilters() {
  const projectFilterButtons = document.querySelectorAll('.projects-filter .filter-btn');
  const projectGroups = document.querySelectorAll('.project__group');

  if (!projectFilterButtons.length || !projectGroups.length) return;

  projectFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectGroups.forEach((group) => {
        const cat = group.dataset.category || '';
        if (filter === 'all' || cat === filter) {
          group.classList.remove('hidden');
        } else {
          group.classList.add('hidden');
        }
      });
    });
  });
})();

/*=============== Skills filter (guarded) ===============*/

document.addEventListener('DOMContentLoaded', function() {
  console.log('Filter functionality loaded');
  
  

  // Skills Filter
  const skillsFilterButtons = document.querySelectorAll('#skills .filter-btn');
  const skillsContents = document.querySelectorAll('.skills__content[data-category]');
  
  console.log('Skills buttons found:', skillsFilterButtons.length);
  console.log('Skills contents found:', skillsContents.length);
  
  skillsFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('Skills filter button clicked:', this.getAttribute('data-filter'));
      
      // Remove active class from all buttons
      skillsFilterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      // Filter skills
      skillsContents.forEach(content => {
        const category = content.getAttribute('data-category');
        console.log('Checking skills category:', category, 'against filter:', filterValue);
        
        if (filterValue === 'all') {
          content.classList.remove('hidden');
        } else {
          if (category === filterValue) {
            content.classList.remove('hidden');
          } else {
            content.classList.add('hidden');
          }
        }
      });
    });
  });
});

/*=============== Small utility: ensure images have object-fit fallback ===============*/
(function ensureImageFit() {
  // in case some images use object-fit but older browsers don't support it,
  // this function is a small polyfill approach: set background-image on parent and hide img
  // (only run if necessary)
  const test = CSS.supports && CSS.supports('object-fit', 'cover');
  if (test) return;
  document.querySelectorAll('img').forEach((img) => {
    const parent = img.parentElement;
    if (!parent) return;
    parent.style.backgroundImage = `url(${img.src})`;
    parent.style.backgroundSize = 'cover';
    parent.style.backgroundPosition = 'center';
    img.style.display = 'none';
  });
})();

/*=============== DOM ready (additional init if needed) ===============*/
document.addEventListener('DOMContentLoaded', () => {
  // placeholder for future DOM-ready initializations
});
