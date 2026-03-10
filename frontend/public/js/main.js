const App = {
    init() {
        this.setupEventListeners();
    },
    setupEventListeners() {
        document.querySelectorAll('form[data-method]').forEach(form => {
            form.addEventListener('submit', async (e) => {
                const method = form.getAttribute('data-method').toUpperCase();
                if (method !== 'POST' && method !== 'GET') {
                    e.preventDefault();
                    
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    
                    try {
                        const response = await fetch(form.action, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });

                        if (response.redirected) {
                            window.location.href = response.url;
                        } else if (response.ok) {
                            window.location.href = '/users';
                        } else {
                            alert('Произошла ошибка при сохранении');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
