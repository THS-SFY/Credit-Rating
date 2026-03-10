mvn archetype:generate -DgroupId=com.example -DartifactId=myserver -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

cat > app.js << 'EOF'
console.log('Node.js development environment is ready!');
console.log('Node.js version:', process.version);
console.log('npm version:', process.env.npm_version);
EOF

mkdir -p views layouts public/css public/js public/images routes controllers middleware config utils

├── app.js
├── package.json
├── .env
├── config/
│   └── app-config.js
├── controllers/
│   └── userController.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── index.js
│   └── users.js
├── views/
│   ├── index.ejs
│   ├── users/
│   │   ├── list.ejs
│   │   ├── create.ejs
│   │   └── edit.ejs
│   └── layouts/
│       └── layout.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
└── utils/
    └── api-client.js

module.exports = {
    app: {
        name: 'имя',
        version: '1.0.0',
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    api: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:8080/api',
        timeout: parseInt(process.env.API_TIMEOUT) || 5000,
        retries: parseInt(process.env.API_RETRIES) || 3
    },
    session: {
        secret: process.env.SESSION_SECRET || 'ключ',
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000
    }
};


NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:8080/api
API_TIMEOUT=5000
SESSION_SECRET=ключ
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080


const express = require('express');
const router = express.Router();
const apiClient = require('../utils/api-client');

router.get('/', async (req, res, next) => {
    try {
        let apiStatus = 'notAvailable';
        try {
            await apiClient.healthCheck();
            apiStatus = 'available';
        } catch (error) {
            console.warn('API health check failed:', error.message);
        }

        res.render('index', {
            title: 'Main',
            apiStatus: apiStatus
        });
    } catch (error) {
        next(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'Hello'
    });
});

module.exports = router;


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.list);

router.get('/create', userController.showCreateForm);

router.post('/', userController.create);

router.get('/:id/edit', userController.showEditForm);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

module.exports = router;


<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %> | WebApp</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    
    <!-- Пользовательские стили -->
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <!-- Навигационное меню -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">
                <i class="bi bi-shield-check"></i>
                WebApp
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Главная</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/users">Пользователи</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/about">О приложении</a>
                    </li>
                </ul>
                
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <span class="navbar-text">
                            <i class="bi bi-person-circle"></i>
                            Гость
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Основной контент -->
    <main class="container mt-4">
        <!-- Сообщения об успехе -->
        <% if (typeof messages !== 'undefined' && messages.length > 0) { %>
            <% messages.forEach(message => { %>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle"></i>
                    <%= message %>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <% }); %>
        <% } %>

        <!-- Сообщения об ошибках -->
        <% if (typeof errors !== 'undefined' && errors.length > 0) { %>
            <% errors.forEach(error => { %>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle"></i>
                    <%= error %>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <% }); %>
        <% } %>

        <!-- Содержимое страницы -->
        <div class="row">
            <div class="col-12">
                <%- body %>
            </div>
        </div>
    </main>

    <!-- Подвал -->
    <footer class="bg-light mt-5 py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <p class="text-muted mb-0">&copy; 2024 WebApp. Все права защищены.</p>
                </div>
                <div class="col-md-6 text-end">
                    <p class="text-muted mb-0">
                        <i class="bi bi-code-slash"></i>
                        Разработано с использованием Node.js и Spring Boot
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Пользовательские скрипты -->
    <script src="/js/main.js"></script>
</body>
</html>


<% include layouts/layout %>

<div class="jumbotron bg-primary text-white p-5 rounded">
    <h1 class="display-4">
        <i class="bi bi-house-door"></i>
        Добро пожаловать в WebApp
    </h1>
    <p class="lead">
        Современное веб-приложение с архитектурой клиент-сервер, 
        построенное на Node.js и Spring Boot
    </p>
    <hr class="my-4 bg-white">
    <p>
        Используйте навигационное меню для работы с приложением
    </p>
    <a class="btn btn-light btn-lg" href="/users" role="button">
        <i class="bi bi-people"></i>
        Управление пользователями
    </a>
</div>

<div class="row mt-5">
    <div class="col-md-4">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi bi-server text-primary"></i>
                    API Сервер
                </h5>
                <p class="card-text">
                    Статус подключения к Backend API:
                    <% if (apiStatus === 'Доступен') { %>
                        <span class="badge bg-success">Доступен</span>
                    <% } else { %>
                        <span class="badge bg-danger">Недоступен</span>
                    <% } %>
                </p>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi bi-shield-check text-success"></i>
                    Безопасность
                </h5>
                <p class="card-text">
                    Приложение использует современные методы защиты данных
                    и аутентификации пользователей
                </p>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi bi-database text-info"></i>
                    База данных
                </h5>
                <p class="card-text">
                    Надежное хранение данных в PostgreSQL
                    с поддержкой транзакций
                </p>
            </div>
        </div>
    </div>
</div>


<div class="d-flex justify-content-between align-items-center mb-4">
    <h1><i class="bi bi-people"></i> Пользователи</h1>
    <a href="/users/create" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i>
        Добавить пользователя
    </a>
</div>

<% if (users.length === 0) { %>
    <div class="alert alert-info">
        <i class="bi bi-info-circle"></i>
        Пользователи не найдены
    </div>
<% } else { %>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Имя пользователя</th>
                    <th>Email</th>
                    <th>Полное имя</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <% users.forEach(user => { %>
                    <tr>
                        <td><%= user.id %></td>
                        <td><%= user.username %></td>
                        <td><%= user.email %></td>
                        <td><%= user.firstName %> <%= user.lastName %></td>
                        <td><%= new Date(user.createdAt).toLocaleDateString('ru-RU') %></td>
                        <td>
                            <div class="btn-group" role="group">
                                <a href="/users/<%= user.id %>/edit" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <button type="button" class="btn btn-sm btn-outline-danger" 
                                        onclick="deleteUser(<%= user.id %>, '<%= user.username %>')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                <% }); %>
            </tbody>
        </table>
    </div>

    <!-- Пагинация -->
    <% if (pagination.total > 1) { %>
        <nav aria-label="Навигация по страницам">
            <ul class="pagination justify-content-center">
                <li class="page-item <%= !pagination.hasPrevious ? 'disabled' : '' %>">
                    <a class="page-link" href="?page=<%= pagination.current - 1 %>">Предыдущая</a>
                </li>
                
                <% for (let i = 0; i < pagination.total; i++) { %>
                    <li class="page-item <%= i === pagination.current ? 'active' : '' %>">
                        <a class="page-link" href="?page=<%= i %>"><%= i + 1 %></a>
                    </li>
                <% } %>
                
                <li class="page-item <%= !pagination.hasNext ? 'disabled' : '' %>">
                    <a class="page-link" href="?page=<%= pagination.current + 1 %>">Следующая</a>
                </li>
            </ul>
        </nav>
    <% } %>
<% } %>

<script>
function deleteUser(userId, username) {
    if (confirm(`Вы уверены, что хотите удалить пользователя "${username}"?`)) {
        fetch(`/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Ошибка при удалении пользователя');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при удалении пользователя');
        });
    }
}
</script>


query = "SELECT * FROM users WHERE id = " + userId;

PreparedStatement stmt = connection.prepareStatement("SELECT * FROM users WHERE id = ?");
stmt.setInt(1, userId);

document.innerHTML= userInput;

document.textContent= userInput;


add_header X-Frame-Options"SAMEORIGIN" always;a
dd_header X-Content-Type-Options"nosniff" always;ad
d_header X-XSS-Protection "1;mode=block" always;add
_header Strict-Transport-Security"max-age=31536000; includeSubDomains" always;

https://lindevs.com/install-jwt-cli-on-ubuntu

https://start.spring.io/

curl https://start.spring.io/starter.zip \
  -d dependencies=web \
  -d type=maven-project \
  -d javaVersion=21 \
  -d bootVersion=3.5.6 \
  -d groupId=com.example \
  -d artifactId=demo \
  -o demo.zip

unzip myarchive.zip -d /path/to/your/destination

https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt

