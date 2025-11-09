/*=============== Active Link =============== */
const navlink = document.querySelectorAll('.nav__link');

function activeLink(){
    navlink.forEach((a) => a.classList.remove('active-link'));
    this.classList.add('active-link');
}
navlink.forEach((a) => a.addEventListener('click', activeLink));


/*=============== Background Header =============== */
function scrollHeader (){
  const header = document.getElementById('header');
  if(this.scrollY >= 50) header.classList.add('scroll-header');
  else header.classList.remove('scroll-header');
}


window.addEventListener('scroll', scrollHeader);

/*=============== Mixitup Filter =============== */
let mixerProjects = mixitup('.projects__container', {
    selectors: {
        target: '.project__item'
    },
    animation: {
        duration: 300
    }
});

/*=============== Project filters (by group) =============== */
// keep MixItUp enabled for project items (it will respect hidden parents),
// but implement group-level filtering by showing/hiding .project__group
const projectFilterButtons = document.querySelectorAll('#project-filters .category__btn');
if (projectFilterButtons.length) {
  projectFilterButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      // active state
      projectFilterButtons.forEach((b) => b.classList.remove('active-work'));
      this.classList.add('active-work');

      const filter = this.dataset.filter;
      const groups = document.querySelectorAll('.project__group');
      if (filter === 'all') {
        groups.forEach((g) => (g.style.display = ''));
      } else {
        groups.forEach((g) => {
          if (g.dataset.groupKey === filter) g.style.display = '';
          else g.style.display = 'none';
        });
      }
    });
  });
}

/*=============== Skills filters =============== */
const skillsFilterButtons = document.querySelectorAll('#skills-filters .skills__btn');
if (skillsFilterButtons.length) {
  skillsFilterButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      skillsFilterButtons.forEach((b) => b.classList.remove('active-skill'));
      this.classList.add('active-skill');

      const skill = this.dataset.skill;
      const sections = document.querySelectorAll('.skills__section');
      if (skill === 'all') {
        sections.forEach((s) => (s.style.display = ''));
      } else {
        sections.forEach((s) => {
          if (s.dataset.skillKey === skill) s.style.display = '';
          else s.style.display = 'none';
        });
      }
    });
  });
}
/*=============== Testimonials Swiper =============== */

var swiper = new Swiper(".testimonial__container", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
  });
/*=============== Contact Form =============== */

const contactForm = document.getElementById('contact-form'),
  contactName = document.getElementById('contact-name'),
  contactEmail = document.getElementById('contact-email'),
  Message = document.getElementById('message'),
  contactMessage = document.getElementById('contact-message');

  const sendEmail = (e) => {
    e.preventDefault();
    
    if (contactName.value === '' || contactEmail.value === '' || Message.value === '') {
      contactMessage.classList.remove('color-light');
      contactMessage.classList.add('color-dark');

      // show message
      contactMessage.textContent = "Write all the input fields.";
    }
    else {
      // serviceID, templateID, #form, publickey
      emailjs.sendForm(
        'service_s5pyocq', 
        'template_mbrgs9w', 
        '#contact-form', 
        '7jXYHGGphtyq79mZ2').then(() => {
        // show message and add color, window 
        contactMessage.classList.add('color-light');
        contactMessage.textContent = 'Message has sent ✅';

        //remove messsage after 4 sec
        setTimeout(() => {
          contactMessage.textContent = '';
        }, 4000);
      }, (error) => {alert('OOPS! SOMETHING WENT WRONG... 😒');
    });
    // clear input fields
    contactName.value = '';
    contactEmail.value = '';
    Message.value = '';
    }
  };
  contactForm.addEventListener('submit', sendEmail);