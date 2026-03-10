const apiClient = require('../utils/api-client');

class CreditController {
    showForm(req, res) {
        res.render('credit/form', {
            title: 'Оценка кредитоспособности',
            messages: [],
            errors: [],
            result: null
        });
    }

    async calculateScore(req, res, next) {
        try {
            const { inn, birthDate } = req.body;

            if (!inn || !birthDate) {
                return res.render('credit/form', {
                    title: 'Оценка кредитоспособности',
                    messages: [],
                    errors: ['Пожалуйста, введите ИНН и Дату рождения клиента'],
                    result: null
                });
            }

            // Отправляем данные на наш Java-бэкенд, который делает парсинг
            const result = await apiClient.getCreditScore(inn, birthDate);

            res.render('credit/form', {
                title: 'Результат оценки',
                messages: ['Оценка успешно выполнена'],
                errors: [],
                result: result
            });

        } catch (error) {
            console.error(error);
            res.render('credit/form', {
                title: 'Оценка кредитоспособности',
                messages: [],
                errors: ['Ошибка при получении данных с внешнего сервиса'],
                result: null
            });
        }
    }
}

module.exports = new CreditController();
