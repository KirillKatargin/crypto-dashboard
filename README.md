# Pulseboard · Crypto Analytics Dashboard

Компактный аналитический дашборд для быстрого сравнения криптоактивов. Проект показывает практические frontend-навыки без лишней инфраструктуры: адаптивная таблица с ручной виртуализацией, URL-фильтры, экспорт, состояние темы и детальная карточка актива.

## Стек

- React 18 + TypeScript + Vite
- Нативный `fetch` к CoinGecko с graceful fallback на демонстрационные данные
- Zod для проверки ответов market и chart API
- ESLint, Prettier и Husky для проверок перед коммитом
- CSS без UI-фреймворка для небольшого initial bundle

## Архитектурные решения

- Список отображает только видимый диапазон строк в scroll-контейнере, поэтому 500+ записей не создают лишний DOM.
- Фильтры и поиск хранятся в query params, а watchlist и тема — в `localStorage`.
- Данные CoinGecko загружаются двумя запросами по 250 активов, обновляются раз в 60 секунд, а при ошибке интерфейс сохраняет последний успешный набор или локальные demo-данные.
- История цены загружается по выбранному периоду, кэшируется в памяти текущей сессии и отображается в модалке с loading/error состояниями.
- Экран разделён на `Header`, `StatsCards`, `Filters`, `MarketTable`, `CoinModal`, API и hook-слои.

## Проверки

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

Тесты покрывают фильтрацию, сортировку, watchlist, CSV, виртуализированный диапазон, Zod-проверку API и performance-порог для 500 строк.

## Запуск локально

```bash
npm install
npm run dev
```

Для production-проверки: `npm run build`.
