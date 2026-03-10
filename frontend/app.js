const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const rateLimit = require('express-rate-limit');
const xssFilters = require('xss'); // Используем современную библиотеку xss
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(methodOverride('_method'));

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const creditRoutes = require('./routes/credit'); // Новый роут для кредитов

// 1. Настройка Helmet (Защита HTTP заголовков)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

// 2. Настройка CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));

// 3. Защита от DDoS и Brute Force (Rate Limiting)
// Ограничиваем количество запросов: максимум 100 запросов за 15 минут с одного IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100,
    message: 'Слишком много запросов с вашего IP, пожалуйста, попробуйте позже.'
});
app.use(limiter);

// Специальный лимитер для проверки кредитов (защита от спама API налоговой)
const scoringLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 минута
    max: 5, // не более 5 проверок кредита в минуту
    message: 'Слишком частые проверки. Подождите 1 минуту.'
});

app.use(morgan('combined'));

app.use(express.json({ limit: '10kb' })); // Ограничиваем размер тела запроса (защита от переполнения)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Очистка пользовательского ввода от вредоносного кода (XSS)
// Пишем свой middleware поверх библиотеки 'xss', так как старый 'xss-clean' сломан в новых версиях Express
app.use((req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xssFilters(req.body[key]);
            }
        }
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/credit', scoringLimiter, creditRoutes); // Применяем жесткий лимит к роутам кредита

app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Страница не найдена',
        message: 'Запрашиваемая страница не существует',
        error: { status: 404 },
        layout: 'layouts/layout'
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    const isDev = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).render('error', {
        title: 'Произошла ошибка',
        message: err.message,
        error: isDev ? err : { status: err.status || 500 },
        layout: 'layouts/layout'
    });
});

app.listen(PORT, () => {
    console.log(`Frontend сервер запущен на порту ${PORT}`);
    console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
