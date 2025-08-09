document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form form');
    const registerForm = document.querySelector('#register-form form');

    if (!loginForm) {
        console.error('Elemento do formulário de login não encontrado!');
    } else {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const login_user = document.getElementById('login_user').value;
            const login_pass = document.getElementById('login_pass').value;

            try {
                const response = await fetch('https://login-and-register-api-ugz9.onrender.com/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',       
                    },
                    body: JSON.stringify({
                        username: login_user,
                        password: login_pass
                    })
                })

                const login = await response.json();

                if (response.ok) {
                    showNotification(login.message || 'Login realizado com sucesso!', 'success');
                    setTimeout(() => {
                        window.location.href = 'https://github.com/JoaoPedroHenriquesB';
                    }, 2000);
                } else {
                    showNotification(login.message || 'Usuário ou senha incorretos!', 'error');  
                }
            } catch (error) {
                console.error('Erro:', error);
                showNotification('Erro ao conectar ao servidor', 'error');
            }
        })
    }

    if (!registerForm) {
        console.error('Elemento do formulário de registro não encontrado!');
    } else {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const register_user = document.getElementById('register_user').value;
            const register_email = document.getElementById('register_email').value;
            const register_pass = document.getElementById('register_pass').value;

            try {
                const response = await fetch('https://login-and-register-api-ugz9.onrender.com/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: register_user,
                        email: register_email,
                        password: register_pass
                    })
                });
       
                const register = await response.json();

                if (response.ok) {
                    showNotification('Conta registrada com sucesso!', 'success');
                } else {
                    showNotification(register.message + (register.error ? ': ' + register.error.sqlMessage : ''), 'error');
                }

            } catch (error) {
                console.error(error)
                showNotification('Algo deu errado! Tente novamente mais tarde.', 'error');
            }
        });
    }
});