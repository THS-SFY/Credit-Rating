const axios = require('axios');
const config = require('../config/app-config');

class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: config.api.baseURL,
            timeout: config.api.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                return Promise.reject(this.formatError(error));
            }
        );
    }

    formatError(error) {
        return {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            details: error.response?.data?.details || null
        };
    }

    async getUsers(page = 0, size = 10) {
        try {
            const response = await this.client.get('/users', { params: { page, size } });
            return response.data;
        } catch(e) {
            // Возвращаем пустой список, если бэкенд не запущен, для демонстрации
            return { content: [], number: 0, totalPages: 0, last: true };
        }
    }

    async getUserById(id) {
        const response = await this.client.get(`/users/${id}`);
        return response.data;
    }

    async createUser(userData) {
        const response = await this.client.post('/users', userData);
        return response.data;
    }

    async updateUser(id, userData) {
        const response = await this.client.put(`/users/${id}`, userData);
        return response.data;
    }

    async deleteUser(id) {
        const response = await this.client.delete(`/users/${id}`);
        return response.data;
    }

    async getCreditScore(inn, birthDate) {
        try {
            const response = await this.client.post('/scoring/calculate', {
                inn: inn,
                birthDate: birthDate
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при запросе скоринга к бэкенду:", error);
            // Возвращаем заглушку на случай если бэкенд выключен, чтобы интерфейс не ломался
            return {
                inn: inn,
                birthDate: birthDate,
                totalScore: Math.floor(Math.random() * (850 - 300 + 1)) + 300,
                decision: 'Требуется проверка',
                colorClass: 'warning',
                nalogStatus: 'Нет связи с сервером',
                fsspStatus: 'Нет связи с сервером',
                kadStatus: 'Нет связи с сервером',
                konturStatus: 'Нет связи с сервером',
                timestamp: new Date().toISOString()
            };
        }
    }

    async healthCheck() {
        // const response = await this.client.get('/health');
        // return response.data;
        return { status: 'UP' }; // Для заглушки, пока нет бэкенда
    }
}

const apiClient = new ApiClient();
module.exports = apiClient;
