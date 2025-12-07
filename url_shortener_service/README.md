# URL Shortener Service

## Запуск проекта

1. Установите Docker и Docker Compose
2. Перейдите в папку проекта: `cd url_shortener_service`
3. Запустите: `docker-compose up --build -d`
4. Дождитесь запуска всех контейнеров (PostgreSQL, Redis, Backend)
5. Приложение доступно на `http://localhost:8080`

## Остановка проекта

- `docker-compose down` - остановка контейнеров
- `docker-compose down -v` - остановка с удалением данных БД

## Swagger UI

После запуска проекта:

1. Откройте браузер: `http://localhost:8080/swagger-ui.html`
2. В Swagger UI доступны все API endpoints
3. Можно тестировать запросы напрямую из интерфейса
4. JSON API документация: `http://localhost:8080/api-docs`

## API Endpoints

- `POST /url` - создание короткой ссылки
  - Body: `{"url": "https://example.com"}`
  - Response: `{"url": "http://localhost:8080/url/{hash}"}`

- `GET /url/{hash}` - получение и редирект на оригинальный URL
  - Возвращает HTTP 302 с заголовком Location

## Архитектура для фронтенда

### Структура проекта

- **Controller** (`UrlController`) - REST API endpoints
- **Service** (`UrlService`) - бизнес-логика
- **Repository** - работа с БД (PostgreSQL) и кешем (Redis)
- **DTO** (`UrlDto`) - объекты для передачи данных

### Рекомендации

1. **CORS настроен** - разрешены все origins, методы и заголовки
2. **Валидация** - URL валидируется на стороне сервера (формат URL обязателен)
3. **Обработка ошибок** - стандартные HTTP статусы (404 для несуществующих hash)
4. **Кеширование** - короткие ссылки кешируются в Redis для быстрого доступа

### Примеры запросов

**Создание короткой ссылки:**
```javascript
fetch('http://localhost:8080/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
})
```

**Получение оригинального URL:**
```javascript
fetch('http://localhost:8080/url/{hash}')
// Редирект происходит автоматически (302)
```
