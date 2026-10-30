# Pulse Analytics Dashboard

Интерактивная панель управления для отслеживания статистики сокращенных ссылок. Часть экосистемы бренда NOVA.

## Функционал
- **Auth System:** Вход и регистрация через интеграцию с Short.ly API.
- **Real-time Stats:** Общая статистика кликов, количество активных ссылок и расчет CTR.
- **Dynamic Charts:** Визуализация активности переходов с помощью Chart.js.
- **URL Management:** Создание, копирование и удаление ссылок прямо из панели.
- **Dark/Light Mode:** Адаптивная тема с сохранением предпочтений пользователя.

## Стек технологий
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3 (Modular CSS).
- **Charts:** Chart.js для визуализации данных.
- **Icons:** Phosphor Icons.
- **API Integration:** REST API (Node.js/Express).

##  Как запустить локально
1. Убедитесь, что запущен бэкенд [Short.ly API](ссылка_на_твой_репо_с_бэкендом).
2. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/твой-логин/analytics-dashboard.git