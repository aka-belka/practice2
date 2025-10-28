/* ======================================================МОДАЛЬНОЕ ОКНО ДЛЯ ПРОЕКТОВ================================================== */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.hidden = true;
    document.body.style.overflow = ''; 
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal__backdrop')) {
        const modal = event.target.closest('.modal');
        modal.hidden = true;
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal:not([hidden])');
        if (openModal) {
            openModal.hidden = true;
            document.body.style.overflow = '';
        }
    }
});



/* ======================================================ФУНКЦИЯ ФИЛЬТРАЦИИ ПРОЕКТОВ================================================== */

function filterProjects(category) {
    const projects = document.querySelectorAll('.project-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
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
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterProjects(filter);
        });
    });
    filterProjects('all');
});



/* =========================================================ФОРМА==================================================== */

document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

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