/* ======================================================МОДАЛЬНОЕ ОКНО ДЛЯ ПРОЕКТОВ================================================== */
if (!HTMLElement.prototype.hasOwnProperty('inert')) {
    Object.defineProperty(HTMLElement.prototype, 'inert', {
        get: function() {
            return this.getAttribute('inert') !== null;
        },
        set: function(value) {
            if (value) {
                this.setAttribute('inert', '');
                this.setAttribute('aria-hidden', 'true');
                this.style.pointerEvents = 'none';
                this.style.userSelect = 'none';
            } else {
                this.removeAttribute('inert');
                this.removeAttribute('aria-hidden');
                this.style.pointerEvents = '';
                this.style.userSelect = '';
            }
        }
    });
}

let previousActiveElement;
let currentOpenModal = null;

function handleCardKeydown(event, modalId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(modalId);
    }
}
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    previousActiveElement = document.activeElement;
    currentOpenModal = modal;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (mainContent) mainContent.inert = true;
    if (header) header.inert = true;
    if (footer) footer.inert = true;
    
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
    if (header) header.setAttribute('aria-hidden', 'true');
    if (footer) footer.setAttribute('aria-hidden', 'true');

    modal.focus();
    
    modal.addEventListener('keydown', trapFocus);
    document.addEventListener('keydown', handleGlobalEscape);;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.hidden = true;
    document.body.style.overflow = '';
    currentOpenModal = null;

    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    if (mainContent) {
        mainContent.inert = false;
        mainContent.removeAttribute('aria-hidden');
    }
    if (header) {
        header.inert = false;
        header.removeAttribute('aria-hidden');
    }
    if (footer) {
        footer.inert = false;
        footer.removeAttribute('aria-hidden');
    }
    if (previousActiveElement) {
        previousActiveElement.focus();
    }
    
    modal.removeEventListener('keydown', trapFocus);
    
    document.removeEventListener('keydown', handleGlobalEscape);
}

function trapFocus(event) {
    if (event.key !== 'Tab') return;
    
    const modal = event.currentTarget;
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modal.querySelectorAll(focusableSelectors);
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal__backdrop')) {
        const modal = event.target.closest('.modal');
        modal.hidden = true;
        document.body.style.overflow = '';
    }
});

function handleGlobalEscape(event) {
    if (event.key === 'Escape' && currentOpenModal) {
        closeModal(currentOpenModal.id);
    }
}



/* ======================================================ФУНКЦИЯ ФИЛЬТРАЦИИ ПРОЕКТОВ================================================== */

function filterProjects(category) {
    const projects = document.querySelectorAll('.project-item');
    if (projects.length === 0) {
        console.log('No projects found on this page');
        return;
    }
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) {
        console.log('No filter buttons found on this page');
        return;
    }
    
    filterButtons.forEach(btn => {
        const isActive = btn.dataset.filter === category;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive.toString());
    });
    
    projects.forEach(project => {
        if (category === 'all') {
            project.classList.remove('hidden');
        } else {
            const categories = project.dataset.categories.split(',');
            if (categories.includes(category)) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length === 0) {
        console.log('No filter buttons to initialize');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterProjects(filter);
        });
    });
    const projects = document.querySelectorAll('.project-item');
    if (projects.length > 0) {
        filterProjects('all');
    }
});



/* =========================================================ФОРМА==================================================== */

document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
if (!form) {
    return; 
}
const inputs = form.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearError);
});

function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.id + 'Error');
    
    if (!field.validity.valid) {
        showError(field, errorElement);
    } else {
        clearError(field, errorElement);
    }
}

function showError(field, errorElement) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    if (field.validity.valueMissing) {
        errorElement.textContent = 'Это поле обязательно для заполнения';
    } else if (field.validity.typeMismatch) {
        errorElement.textContent = 'Пожалуйста, введите корректный email';
    } else if (field.validity.tooShort) {
        errorElement.textContent = `Минимальная длина: ${field.minLength} символов`;
    } else if (field.validity.tooLong) {
        errorElement.textContent = `Максимальная длина: ${field.maxLength} символов`;
    }
    
}

function clearError(e) {
    const field = e.target || e;
    const errorElement = document.getElementById(field.id + 'Error');
    
    field.classList.remove('error');
    errorElement.textContent = '';
}

form.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !successMessage.hidden) {
        successMessage.hidden = true;
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    inputs.forEach(input => {
        if (!input.validity.valid) {
            const errorElement = document.getElementById(input.id + 'Error');
            showError(input, errorElement);
            isValid = false;
        }
    });

    if (isValid) {
        setTimeout(() => {
            form.reset();
            successMessage.hidden = false;
            setTimeout(() => {
                successMessage.hidden = true;
            }, 5000);
        }, 1000);
    }
});
});