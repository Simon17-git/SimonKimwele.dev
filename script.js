// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  
  skillBars.forEach((bar, index) => {
    const level = bar.getAttribute('data-level');
    bar.style.setProperty('--level', level + '%');
    
    // Trigger animation when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger the animation for each skill bar
          setTimeout(() => {
            bar.style.width = level + '%';
            bar.style.opacity = '1';
            
            // Add a subtle bounce effect
            bar.style.transform = 'scaleX(1.05)';
            setTimeout(() => {
              bar.style.transform = 'scaleX(1)';
            }, 200);
          }, index * 200);
          
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(bar);
  });
}

// ===== SCROLL TRIGGERED ANIMATIONS =====
function animateOnScroll() {
  const elements = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .stat');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in', 'visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ===== FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
         // EmailJS configuration
     const serviceID = 'service_gznlx7r'; 
     const templateID = 'template_98euvcl'; 
     emailjs.init("cF9ukH6H4zxkw3bf0"); 

    // Prepare email parameters
    const templateParams = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      to_name: 'Simon Kimwele'
    };
    
    // Send email using EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.init("cF9ukH6H4zxkw3bf0");
      emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
          showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
          this.reset();
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          showNotification('Failed to send message. Please try again or contact me directly.', 'error');
        })
        .finally(() => {
          // Reset button state
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    } else {
      // Fallback if EmailJS is not loaded
      showNotification('Email service not available. Please contact me directly.', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ===== TYPING ANIMATION FOR HERO TITLE =====
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ===== PARALLAX EFFECT FOR HERO SECTION =====
function parallaxEffect() {
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }
}

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ===== PROJECT CARD HOVER EFFECTS =====
function initProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// ===== SKILL CARD INTERACTIONS =====
function initSkillCards() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.skill-icon');
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.skill-icon');
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
  });
}

// ===== LAZY LOADING FOR IMAGES =====
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ===== SCROLL TO TOP BUTTON =====
function createScrollToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  button.className = 'scroll-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  `;
  
  document.body.appendChild(button);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  });
  
  // Scroll to top functionality
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-3px) scale(1.1)';
    button.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
  });
}

// ===== INITIALIZE ALL FUNCTIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  animateSkillBars();
  animateOnScroll();
  parallaxEffect();
  highlightActiveNav();
  initProjectCards();
  initSkillCards();
  lazyLoadImages();
  createScrollToTopButton();
  createParticleSystem();
  
  // Add typing animation to hero title
  const heroTitle = document.querySelector('.hero-title .name');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 150);
    }, 1000);
  }
  
  // Add CSS for active nav link
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: #667eea !important;
    }
    .nav-link.active::after {
      width: 100% !important;
    }
    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      pointer-events: none;
      animation: float-particle 6s ease-in-out infinite;
    }
    @keyframes float-particle {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
      50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
  // Scroll event handlers here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }
});

// Add focus management for mobile menu
hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    hamburger.click();
  }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Portfolio error:', e.error);
  // You could send this to an error tracking service
});

// ===== PARTICLE SYSTEM =====
function createParticleSystem() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2px and 8px
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
    
    hero.appendChild(particle);
  }
}

// ===== ANALYTICS (OPTIONAL) =====
function trackPageView() {
  // Add your analytics tracking here
  console.log('Portfolio page viewed');
}

function trackEvent(eventName, data = {}) {
  // Add your event tracking here
  console.log('Event tracked:', eventName, data);
}

// Track important interactions
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-primary')) {
    trackEvent('button_click', { button: 'primary' });
  }
  if (e.target.matches('.project-link')) {
    trackEvent('project_link_click', { project: e.target.closest('.project-card')?.querySelector('h3')?.textContent });
  }
});

// Initialize tracking
trackPageView(); 