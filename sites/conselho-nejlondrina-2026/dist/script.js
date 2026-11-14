const progressBar = document.querySelector('.progress span');

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('[data-trio-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.trio-carousel__viewport img')];
  const dots = [...carousel.querySelectorAll('.trio-carousel__dots button')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === current));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === current));
  }

  function startRotation() {
    if (reduceMotion || timer) return;
    timer = window.setInterval(() => showSlide(current + 1), 3200);
  }

  function stopRotation() {
    window.clearInterval(timer);
    timer = undefined;
  }

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    stopRotation();
    startRotation();
  }));
  carousel.addEventListener('mouseenter', stopRotation);
  carousel.addEventListener('mouseleave', startRotation);
  carousel.addEventListener('focusin', stopRotation);
  carousel.addEventListener('focusout', startRotation);
  startRotation();
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');

document.querySelectorAll('.memory').forEach((button) => {
  button.addEventListener('click', () => {
    const source = button.dataset.full;
    const image = button.querySelector('img');
    lightboxImage.src = source;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});

lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

const biscuit = document.querySelector('.biscuit');
document.querySelector('[data-biscuit]').addEventListener('click', () => biscuit.showModal());
biscuit.querySelector('.biscuit__close').addEventListener('click', () => biscuit.close());
biscuit.addEventListener('click', (event) => {
  if (event.target === biscuit) biscuit.close();
});
