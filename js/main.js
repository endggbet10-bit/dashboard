// === MAIN.JS — тема и навигация ===

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
    // ============================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Восстанавливаем тему из localStorage
    const savedTheme = localStorage.getItem('pulse_theme');
    if (savedTheme === 'light') {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        if (themeIcon) {
            themeIcon.classList.remove('ph-sun');
            themeIcon.classList.add('ph-moon');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.contains('theme-dark');

            if (isDark) {
                body.classList.remove('theme-dark');
                body.classList.add('theme-light');
                themeIcon.classList.remove('ph-sun');
                themeIcon.classList.add('ph-moon');
                localStorage.setItem('pulse_theme', 'light');
            } else {
                body.classList.remove('theme-light');
                body.classList.add('theme-dark');
                themeIcon.classList.remove('ph-moon');
                themeIcon.classList.add('ph-sun');
                localStorage.setItem('pulse_theme', 'dark');
            }

            // Перерисовываем график под новую тему (если charts.js уже загружен)
            if (typeof window.updateChartTheme === 'function') {
                window.updateChartTheme();
            }
        });
    }


    // ============================
    // 2. САЙДБАР (мобилка)
    // ============================
    const sidebar = document.getElementById('sidebar');
    const sidebarOpen = document.getElementById('sidebarOpen');
    const sidebarClose = document.getElementById('sidebarClose');

    if (sidebarOpen) {
        sidebarOpen.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Закрытие сайдбара при клике на ссылку (на мобилке)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });


    // ============================
    // 3. АКТИВНЫЙ ПУНКТ МЕНЮ
    // ============================
    document.querySelectorAll('.sidebar__nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar__nav .nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

});