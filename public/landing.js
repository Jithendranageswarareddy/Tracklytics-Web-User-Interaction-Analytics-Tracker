const hamburger = document.getElementById('hamburger');
const navbarMenu = document.querySelector('.navbar-menu');
const navbar = document.querySelector('.navbar');

if (hamburger && navbarMenu) {
  hamburger.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    navbarMenu?.classList.remove('active');
    hamburger?.classList.remove('active');
  });
});

window.addEventListener('scroll', () => {
  if (!navbar) {
    return;
  }

  navbar.classList.toggle('scrolled', window.scrollY > 0);
});

document.querySelectorAll('.nav-link, .cta-button').forEach((element) => {
  element.addEventListener('click', () => {
    trackButtonClick('home', { beacon: true, keepalive: true });
  });
});

window.addEventListener('load', () => {
  trackPageView('home');
});
