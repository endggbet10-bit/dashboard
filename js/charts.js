// === график кликов ===

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('clicksChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Данные (пока захардкожены — в будущем можно тянуть из API)
    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const dataValues = [420, 680, 510, 890, 740, 1100, 950];

    // Цвета в зависимости от темы
    function getThemeColors() {
        const isDark = document.body.classList.contains('theme-dark');
        return {
            text: isDark ? '#888888' : '#6b7280',
            grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            line: isDark ? '#00ff88' : '#10b981',
            fill: isDark ? 'rgba(0, 255, 136, 0.12)' : 'rgba(16, 185, 129, 0.12)'
        };
    }

    let colors = getThemeColors();

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Клики',
                data: dataValues,
                borderColor: colors.line,
                backgroundColor: colors.fill,
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,           // плавная кривая
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: colors.line,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    titleColor: '#fff',
                    bodyColor: '#ccc',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    ticks: { color: colors.text, font: { size: 12 } },
                    grid: { color: colors.grid, drawBorder: false }
                },
                y: {
                    ticks: { color: colors.text, font: { size: 12 } },
                    grid: { color: colors.grid, drawBorder: false },
                    beginAtZero: true
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Чтобы контейнер графика имел высоту
    canvas.parentElement.style.height = '280px';

    // Функция обновления темы графика (вызывается из main.js)
    window.updateChartTheme = function () {
        colors = getThemeColors();

        chart.data.datasets[0].borderColor = colors.line;
        chart.data.datasets[0].backgroundColor = colors.fill;
        chart.data.datasets[0].pointBackgroundColor = colors.line;

        chart.options.scales.x.ticks.color = colors.text;
        chart.options.scales.y.ticks.color = colors.text;
        chart.options.scales.x.grid.color = colors.grid;
        chart.options.scales.y.grid.color = colors.grid;

        chart.update();
    };
});