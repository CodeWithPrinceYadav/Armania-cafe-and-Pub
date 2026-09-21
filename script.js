/**
 * Armania Pub & Cafe - Official Interaction Script
 */

// 1. Digital Menu PDF Opener (FIXED: Added function)
function openMenuPdf() {
  window.open('menu.pdf', '_blank');
}

// 2. Preloader Lifecycle
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});

// 3. Navbar Sticky Styling & Active Link Spy
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('header[id], section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Sticky Navbar state
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active Link Spy
  let currentId = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });

  // Back To Top Button trigger
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }
});

// Back To Top Click
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 4. Mobile Menu Drawer Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-links');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });
}

// 5. Light / Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  const themeIcon = themeToggle.querySelector('i');
  const savedTheme = localStorage.getItem('armania-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeIcon) updateThemeIcon(themeIcon, savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('armania-theme', newTheme);
    if (themeIcon) updateThemeIcon(themeIcon, newTheme);
  });
}

function updateThemeIcon(themeIcon, theme) {
  if (theme === 'light') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}

// 6. Gallery Slider & Lightbox
const sliderTrack = document.getElementById('sliderTrack');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
const dotsContainer = document.getElementById('sliderDots');

let currentSlide = 0;
const totalSlides = slides.length;

if (dotsContainer && totalSlides > 0) {
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });
}

function updateSlider() {
  if (!sliderTrack) return;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

let slideInterval = setInterval(nextSlide, 6000);
const sliderWrapper = document.querySelector('.slider-wrapper');
if (sliderWrapper) {
  sliderWrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
  sliderWrapper.addEventListener('mouseleave', () => (slideInterval = setInterval(nextSlide, 6000)));
}

// Lightbox logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(slideElement) {
  if (!lightbox || !lightboxImg) return;
  const img = slideElement.querySelector('img');
  const caption = slideElement.querySelector('.slide-caption');
  lightboxImg.src = img.src;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightbox.style.display = 'flex';
}

function closeLightbox() {
  if (lightbox) lightbox.style.display = 'none';
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      closeLightbox();
    }
  });
}

// 7. WhatsApp Reservation System
const CAFE_WHATSAPP_NUMBER = "9827276528"; 

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("bookingDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }
});

function handleWhatsAppBooking(event) {
  event.preventDefault();

  const nameInput = document.getElementById("guestName");
  const phoneInput = document.getElementById("guestPhone");
  const guestsInput = document.getElementById("guestCount");
  const dateInput = document.getElementById("bookingDate");
  const timeInput = document.getElementById("bookingTime");
  const requestInput = document.getElementById("specialRequest");
  const alertBox = document.getElementById("bookingAlert");

  clearErrors();

  const name = nameInput.value.trim();
  const rawPhone = phoneInput.value.trim().replace(/[^0-9]/g, "");
  const guests = guestsInput.value;
  const date = dateInput.value;
  const time = timeInput.value;
  const request = requestInput.value.trim() || "None";

  let isValid = true;

  if (name.length < 2) {
    showError(nameInput, "nameError", "Please enter your full name.");
    isValid = false;
  }

  if (rawPhone.length < 10) {
    showError(phoneInput, "phoneError", "Enter a valid 10-digit mobile number.");
    isValid = false;
  }

  if (!guests) {
    showError(guestsInput, "guestsError", "Please select party size.");
    isValid = false;
  }

  if (!date) {
    showError(dateInput, "dateError", "Please pick a reservation date.");
    isValid = false;
  }

  if (!time) {
    showError(timeInput, "timeError", "Please choose reservation timing.");
    isValid = false;
  }

  if (!isValid) return;

  const [year, month, day] = date.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  const message = 
`🍽️ New Table Reservation – Armania Pub & Café
👤 Name: ${name}
📱 Phone: ${rawPhone}
📅 Date: ${formattedDate}
⏰ Time: ${time}
👥 Guests: ${guests}
📝 Special Request: ${request}

Please confirm the reservation with the customer.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CAFE_WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");

  if (alertBox) {
    alertBox.className = "booking-alert success";
    alertBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> Redirecting to WhatsApp! Send the message to complete booking.`;
    alertBox.style.display = "flex";

    document.getElementById("bookingForm").reset();

    setTimeout(() => {
      alertBox.style.display = "none";
    }, 7000);
  }
}

function showError(inputElement, errorElementId, message) {
  inputElement.classList.add("invalid");
  const errorElement = document.getElementById(errorElementId);
  if (errorElement) errorElement.textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".booking-form .invalid").forEach((el) => el.classList.remove("invalid"));
  document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
}

// 8. Intersection Observer for Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach((el) => scrollObserver.observe(el));