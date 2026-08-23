/* =========================================================
   GALLERY SLIDER
========================================================= */
let currentSlide = 0;
let slideTimer = null;

function getSlides() {
    return document.querySelectorAll('.slide');
}

function moveSlide(step) {
    const slides = getSlides();
    const totalSlides = slides.length;
    if (!totalSlides) return;

    currentSlide = (currentSlide + step + totalSlides) % totalSlides;

    const slider = document.querySelector('.gallery-slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
}

function goToSlide(index) {
    currentSlide = index;
    const slider = document.querySelector('.gallery-slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll('.dots span');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function buildDots() {
    const dotsContainer = document.getElementById('galleryDots');
    const slides = getSlides();
    if (!dotsContainer || !slides.length) return;

    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
}

function startAutoplay() {
    stopAutoplay();
    slideTimer = setInterval(() => moveSlide(1), 5000);
}
function stopAutoplay() {
    if (slideTimer) clearInterval(slideTimer);
}

/* Tap-to-toggle image caption on touch devices (hover doesn't exist there) */
function setupSlideCaptions() {
    const slides = getSlides();
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (!isTouch) return;

    slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
            const alreadyOpen = slide.classList.contains('show-caption');
            slides.forEach(s => s.classList.remove('show-caption'));
            if (!alreadyOpen) slide.classList.add('show-caption');
        });
    });
}

/* =========================================================
   NAV: mobile toggle + active link on scroll
========================================================= */
function setupNav() {
    const toggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    if (toggle && navList) {
        toggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
        });
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(section => spy.observe(section));
}

/* =========================================================
   SCROLL REVEAL
========================================================= */
function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
}

/* =========================================================
   CONTACT FORM (placeholder — hook up localStorage/backend here later)
========================================================= */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: read form fields and persist them (e.g. to localStorage) here.
        if (status) {
            status.textContent = "Thanks! I'll get back to you soon.";
            status.classList.remove('show');
            // restart animation
            void status.offsetWidth;
            status.classList.add('show');
        }
        form.reset();
    });
}

/* =========================================================
   FOOTER YEAR
========================================================= */
function setupYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    buildDots();
    startAutoplay();
    setupSlideCaptions();

    const gallery = document.querySelector('.gallery-container');
    if (gallery) {
        gallery.addEventListener('mouseenter', stopAutoplay);
        gallery.addEventListener('mouseleave', startAutoplay);
    }

    setupNav();
    setupReveal();
    setupContactForm();
    setupYear();
});
