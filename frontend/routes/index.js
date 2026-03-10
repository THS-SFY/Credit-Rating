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
            title: 'Главная',
            apiStatus: apiStatus === 'available' ? 'Доступен' : 'Недоступен',
            messages: [],
            errors: []
        });
    } catch (error) {
        next(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'О приложении',
        messages: [],
        errors: []
    });
});

module.exports = router;
