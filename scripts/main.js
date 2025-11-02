// ==================== ОСНОВНОЙ СКРИПТ ====================

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeFilters();
    initializeForms();
    initializeNavigation();
});

// ==================== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ====================

function initializePage() {
    // Анимация появления элементов при загрузке
    const animatedElements = document.querySelectorAll('.skill-progress, .project-card, .timeline-item');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Анимация прогресс-баров навыков
    animateSkillBars();
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 500);
    });
}

// ==================== ФИЛЬТРАЦИЯ ПРОЕКТОВ ====================

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удаляем активный класс со всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Фильтруем проекты
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ==================== ФОРМЫ ====================

function initializeForms() {
    // Контактная форма
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Форма дневника
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
        diaryForm.addEventListener('submit', handleDiarySubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Очищаем сообщения об ошибках
    clearErrorMessages();

    let isValid = true;

    // Валидация имени
    if (name.length < 2) {
        showError('nameError', 'Имя должно содержать минимум 2 символа');
        isValid = false;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Пожалуйста, введите корректный email');
        isValid = false;
    }

    // Валидация сообщения
    if (message.length < 10) {
        showError('messageError', 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
    }

    if (isValid) {
        showSuccessMessage(`Спасибо, ${name}! Ваше сообщение отправлено. Мы ответим на ${email} в ближайшее время.`);
        contactForm.reset();
    }
}

function handleDiarySubmit(e) {
    e.preventDefault();

    const entryDate = document.getElementById('entryDate').value.trim();
    const entryTitle = document.getElementById('entryTitle').value.trim();
    const entryDescription = document.getElementById('entryDescription').value.trim();
    const entryStatus = document.getElementById('entryStatus').value;

    if (!entryDate || !entryTitle || !entryDescription) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    addDiaryEntry(entryDate, entryTitle, entryDescription, entryStatus);
    closeDiaryModal();
}

function addDiaryEntry(date, title, description, status) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const statusText = status === 'completed' ? '✓ Завершено' : '⏳ В процессе';
    const statusClass = status === 'completed' ? 'completed' : 'in-progress';

    const newEntry = document.createElement('div');
    newEntry.className = `timeline-item ${statusClass}`;
    newEntry.innerHTML = `
        <div class="timeline-date">${date}</div>
        <div class="timeline-content">
            <h3>${title}</h3>
            <p>${description}</p>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
    `;

    // Добавляем в начало списка
    timeline.insertBefore(newEntry, timeline.firstChild);

    // Анимация появления
    newEntry.style.opacity = '0';
    newEntry.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        newEntry.style.transition = 'all 0.5s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateX(0)';
    }, 10);

    showSuccessMessage('✅ Запись успешно добавлена в дневник!');
    updateStats();
}

function updateStats() {
    const statsValue = document.querySelector('.stat-value');
    if (statsValue) {
        const currentValue = parseInt(statsValue.textContent);
        statsValue.textContent = currentValue + 1;
    }
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================

// Данные проектов
const projectsData = {
    project1: {
        title: 'React E-Commerce Store',
        category: 'React, Commerce.js',
        description: 'Полнофункциональный интернет-магазин с системой корзины, оформления заказа и интеграцией платежей.',
        details: 'Проект использует Commerce.js для управления продуктами и заказами, Stripe для обработки платежей. Реализована фильтрация товаров, поиск и система рейтингов.',
        technologies: ['React', 'Commerce.js', 'Stripe', 'Material-UI', 'React Router'],
        github: 'https://github.com/chetanverma16/react-ecommerce-template',
        live: 'https://react-ecommerce-template.vercel.app'
    },
    project2: {
        title: 'CSS Gradient Generator',
        category: 'JavaScript, CSS3',
        description: 'Инструмент для создания красивых CSS градиентов с реальным предпросмотром и экспортом кода.',
        details: 'Генерация линейных, радиальных и конических градиентов. Настройка цветов, углов и прозрачности. Экспорт готового CSS кода.',
        technologies: ['JavaScript', 'CSS3', 'Color Picker', 'Clipboard API'],
        github: 'https://github.com/ghosh/uiGradients',
        live: 'https://uigradients.com'
    },
    project3: {
        title: 'Memory Card Game',
        category: 'JavaScript, CSS3',
        description: 'Классическая игра на память с анимированными карточками и системой подсчета очков.',
        details: 'Реализована логика совпадения карточек, таймер, система уровней сложности. Плавные анимации переворота карточек.',
        technologies: ['JavaScript', 'CSS3', 'CSS Animations', 'Game Logic'],
        github: 'https://github.com/taniarascia/memory',
        live: 'https://taniarascia.github.io/memory'
    },
    project4: {
        title: 'Movie Search App',
        category: 'React, OMDB API',
        description: 'Приложение для поиска фильмов с детальной информацией, трейлерами и рейтингами.',
        details: 'Поиск по названию, актерам, жанрам. Детальные страницы с актерским составом, рецензиями и рекомендациями.',
        technologies: ['React', 'OMDB API', 'React Router', 'Axios', 'Responsive Design'],
        github: 'https://github.com/amirhazizi/reactjs-movies-app',
        live: 'https://reactjs-movies-app.netlify.app'
    }
};

function openModal(projectId) {
    const project = projectsData[projectId];
    const modalBody = document.getElementById('modalBody');

    if (!project || !modalBody) return;

    const htmlContent = `
        <h2>${project.title}</h2>
        <p class="project-category"><strong>Категория:</strong> ${project.category}</p>
        <p class="project-description">${project.description}</p>
        <p class="project-details"><strong>Детали реализации:</strong> ${project.details}</p>
        <div class="technologies-section">
            <strong>Использованные технологии:</strong>
            <div class="technologies-list">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="project-links">
            <a href="${project.github}" target="_blank" class="btn btn-primary">GitHub</a>
            <a href="${project.live}" target="_blank" class="btn btn-secondary">Живая версия</a>
        </div>
    `;

    modalBody.innerHTML = htmlContent;
    document.getElementById('projectModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
}

function openDiaryModal() {
    document.getElementById('diaryModal').style.display = 'block';
}

function closeDiaryModal() {
    const modal = document.getElementById('diaryModal');
    if (modal) {
        modal.style.display = 'none';
        const diaryForm = document.getElementById('diaryForm');
        if (diaryForm) {
            diaryForm.reset();
        }
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

function showSuccessMessage(message) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

function initializeNavigation() {
    // Плавная прокрутка для якорных ссылок
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

    // Обновление активной навигации при прокрутке
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Закрытие модальных окон при клике вне их
window.addEventListener('click', function(event) {
    const projectModal = document.getElementById('projectModal');
    const diaryModal = document.getElementById('diaryModal');
    
    if (event.target === projectModal) {
        closeModal();
    }
    if (event.target === diaryModal) {
        closeDiaryModal();
    }
});

// Закрытие модальных окон по Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeDiaryModal();
    }
});

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .tech-tag {
        display: inline-block;
        background: var(--background-light);
        color: var(--text-primary);
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
        margin: 0.25rem;
        border: 1px solid var(--border-color);
    }
    
    .technologies-list {
        margin-top: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .project-links {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .project-category {
        color: var(--accent-color);
        font-weight: 600;
        margin-bottom: 1rem;
    }
    
    .project-description {
        color: var(--text-primary);
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    
    .project-details {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
`;
document.head.appendChild(style);