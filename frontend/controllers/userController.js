const apiClient = require('../utils/api-client');

class UserController {
    async list(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 0;
            const size = parseInt(req.query.size) || 10;
            
            const response = await apiClient.getUsers(page, size);
            
            res.render('users/list', {
                title: 'Список пользователей',
                users: response.content || [],
                pagination: {
                    current: response.number || 0,
                    total: response.totalPages || 0,
                    hasNext: !response.last,
                    hasPrevious: response.number > 0
                },
                messages: req.query.success ? [req.query.success] : [],
                errors: req.query.error ? [req.query.error] : []
            });
        } catch (error) {
            next(error);
        }
    }

    async showCreateForm(req, res) {
        res.render('users/create', {
            title: 'Создание пользователя',
            user: {},
            errors: [],
            messages: []
        });
    }

    async create(req, res, next) {
        try {
            const userData = {
                username: req.body.username?.trim(),
                email: req.body.email?.trim(),
                inn: req.body.inn?.trim(), // Добавили ИНН
                firstName: req.body.firstName?.trim(),
                lastName: req.body.lastName?.trim(),
                password: req.body.password
            };

            const validationErrors = this.validateUserData(userData);
            if (validationErrors.length > 0) {
                return res.render('users/create', {
                    title: 'Создание пользователя',
                    user: userData,
                    errors: validationErrors,
                    messages: []
                });
            }

            await apiClient.createUser(userData);
            res.redirect('/users?success=' + encodeURIComponent('Пользователь успешно создан'));
        } catch (error) {
            if (error.status === 400) {
                return res.render('users/create', {
                    title: 'Создание пользователя',
                    user: req.body,
                    errors: [error.message],
                    messages: []
                });
            }
            next(error);
        }
    }

    async showEditForm(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await apiClient.getUserById(userId);
            
            res.render('users/edit', {
                title: 'Редактирование пользователя',
                user: user,
                errors: [],
                messages: []
            });
        } catch (error) {
            if (error.status === 404) {
                return res.redirect('/users?error=' + encodeURIComponent('Пользователь не найден'));
            }
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const userId = req.params.id;
            const userData = {
                username: req.body.username?.trim(),
                email: req.body.email?.trim(),
                inn: req.body.inn?.trim(), // Добавили ИНН
                firstName: req.body.firstName?.trim(),
                lastName: req.body.lastName?.trim()
            };

            if (req.body.password && req.body.password.trim()) {
                userData.password = req.body.password;
            }

            const validationErrors = this.validateUserData(userData, false);
            if (validationErrors.length > 0) {
                return res.render('users/edit', {
                    title: 'Редактирование пользователя',
                    user: { id: userId, ...userData },
                    errors: validationErrors,
                    messages: []
                });
            }

            await apiClient.updateUser(userId, userData);
            res.redirect('/users?success=' + encodeURIComponent('Пользователь успешно обновлен'));
        } catch (error) {
            if (error.status === 400) {
                return res.render('users/edit', {
                    title: 'Редактирование пользователя',
                    user: { id: req.params.id, ...req.body },
                    errors: [error.message],
                    messages: []
                });
            }
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const userId = req.params.id;
            await apiClient.deleteUser(userId);
            res.redirect('/users?success=' + encodeURIComponent('Пользователь успешно удален'));
        } catch (error) {
            if (error.status === 404) {
                return res.redirect('/users?error=' + encodeURIComponent('Пользователь не найден'));
            }
            next(error);
        }
    }

    validateUserData(userData, requirePassword = true) {
        const errors = [];
        if (!userData.username || userData.username.length < 3) {
            errors.push('Имя пользователя должно содержать минимум 3 символа');
        }
        if (!userData.email || !this.isValidEmail(userData.email)) {
            errors.push('Введите корректный email адрес');
        }
        if (!userData.firstName || userData.firstName.length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        if (!userData.lastName || userData.lastName.length < 2) {
            errors.push('Фамилия должна содержать минимум 2 символа');
        }
        if (requirePassword && (!userData.password || userData.password.length < 6)) {
            errors.push('Пароль должен содержать минимум 6 символов');
        }
        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = new UserController();
