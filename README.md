# Dockforge

Веб-генератор `docker-compose.yml` 

## Возможности

- Генерация `docker-compose.yml`: образы, имена контейнеров и порты для бэкенда и фронтенда


## Стек

- Бэкенд: NestJS, TypeScript
- Фронтенд: React, TypeScript

## Структура

```
src/                  # бэкенд (NestJS)
frontend/dockDorge/   # фронтенд (React)
```

## Запуск

Бэкенд (порт 3000):

```bash
npm install
npm run start:dev
```

Фронтенд:

```bash
cd frontend/dockDorge
npm install
npm run dev
```

## API

| Метод | Путь                  | Описание                         |
|-------|-----------------------|----------------------------------|
| POST  | `/generator/compose`  | Генерирует `docker-compose.yml`  |

