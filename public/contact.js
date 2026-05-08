const contactForm = document.getElementById('contactForm');
const fields = {
  name: document.getElementById('nameInput'),
  email: document.getElementById('emailInput'),
  subject: document.getElementById('subjectInput'),
  message: document.getElementById('messageInput')
};

const rules = {
  name: {
    isValid: (value) => value.trim().length >= 3,
    message: 'Please enter at least 3 characters'
  },
  email: {
    isValid: (value) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value.trim()),
    message: 'Please enter a valid email address'
  },
  subject: {
    isValid: (value) => value.trim().length >= 5,
    message: 'Subject must be at least 5 characters'
  },
  message: {
    isValid: (value) => value.trim().length >= 10,
    message: 'Message must be at least 10 characters'
  }
};

function getErrorElement(input) {
  return document.getElementById(input.id.replace('Input', 'Error'));
}

function setFieldError(input, message) {
  const errorElement = getErrorElement(input);
  input.classList.add('error');

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function clearFieldError(input) {
  const errorElement = getErrorElement(input);
  input.classList.remove('error');

  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

function validateField(fieldName) {
  const input = fields[fieldName];
  const rule = rules[fieldName];

  if (!input || !rule) {
    return true;
  }

  if (!rule.isValid(input.value)) {
    setFieldError(input, rule.message);
    return false;
  }

  clearFieldError(input);
  return true;
}

function validateForm() {
  let isValid = true;

  Object.keys(fields).forEach((fieldName) => {
    if (!validateField(fieldName)) {
      isValid = false;
    }
  });

  return isValid;
}

function resetForm() {
  contactForm.reset();

  Object.keys(fields).forEach((fieldName) => {
    if (fields[fieldName]) {
      clearFieldError(fields[fieldName]);
    }
  });

  const charCount = document.getElementById('charCount');
  if (charCount) {
    charCount.textContent = '0';
  }
}

if (contactForm) {
  Object.keys(fields).forEach((fieldName) => {
    const input = fields[fieldName];

    if (!input) {
      return;
    }

    input.addEventListener('input', () => {
      if (input.value.length > 0) {
        validateField(fieldName);
      } else {
        clearFieldError(input);
      }
    });
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await trackFormSubmission('contact');

    if (!result.success) {
      console.error('Form tracking failed:', result.error);
    }

    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
      successMessage.classList.add('show');
      setTimeout(() => successMessage.classList.remove('show'), 3000);
    }

    resetForm();
  });
}

const messageInput = fields.message;
const charCount = document.getElementById('charCount');

if (messageInput && charCount) {
  messageInput.addEventListener('input', () => {
    if (messageInput.value.length > 500) {
      messageInput.value = messageInput.value.slice(0, 500);
    }

    charCount.textContent = messageInput.value.length;
  });
}

const hamburger = document.getElementById('hamburger');
const navbarMenu = document.getElementById('navbarMenu');
const navbar = document.querySelector('.navbar');

if (hamburger && navbarMenu) {
  hamburger.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      trackButtonClick('contact', { beacon: true, keepalive: true });
      navbarMenu.classList.remove('active');
    });
  });
}

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 0);
});

document.querySelectorAll('.faq-question').forEach((question) => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;

    document.querySelectorAll('.faq-question').forEach((otherQuestion) => {
      if (otherQuestion !== question) {
        otherQuestion.classList.remove('active');
        otherQuestion.nextElementSibling?.classList.remove('show');
      }
    });

    question.classList.toggle('active');
    answer?.classList.toggle('show');
  });
});

window.addEventListener('load', () => {
  trackPageView('contact');
});
