# 🎮 Тетрис — статический сайт с CI/CD на GitHub Pages

![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?style=for-the-badge&logo=githubpages)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Описание

Полноценная реализация классического **Тетриса** на чистом HTML5, CSS3 и JavaScript без единого фреймворка. Сайт автоматически деплоится на GitHub Pages через GitHub Actions при каждом push в `main`.

![Скриншот игры](screenshots/game.jpg)

## 🎯 Цель проекта

- Развернуть статический сайт на GitHub Pages
- Настроить автоматический CI/CD через GitHub Actions
- Освоить командную работу с Git и ветвлением
- Реализовать интерактивную игру с нуля

## 🛠️ Технологии

- **HTML5** — разметка страниц
- **CSS3** — glassmorphism, градиенты, адаптив
- **JavaScript (ES6+)** — логика игры
- **Canvas API** — отрисовка игрового поля
- **GitHub Actions** — автоматический деплой
- **GitHub Pages** — бесплатный хостинг
- **localStorage** — таблица рекордов

## 📁 Структура проекта

```mermaid
graph TD
    A[index.html<br/>Игра] --> B[rules.html<br/>Правила]
    A --> C[records.html<br/>Рекорды]
    A --> D[about.html<br/>О проекте]
    A --> E[404.html<br/>Страница ошибки]
    A --> F[style.css<br/>Стили]
    A --> G[script.js<br/>Логика игры]
    H[.github/workflows/deploy.yml<br/>CI/CD пайплайн] -.->|push в main| I[GitHub Pages]
