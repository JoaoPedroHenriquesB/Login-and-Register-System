document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#login-form form').addEventListener('submit', async (e) => {
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
                alert(login.message || 'Login bem-sucedido!')
                window.location.href = 'https://github.com/JoaoPedroHenriquesB';
            } else {
                alert(login.message || 'Usuário ou senha incorretos!');  
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar ao servidor')
        }
    })

    document.querySelector('#register-form form').addEventListener('submit', async (e) => {
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
                alert('Conta Registrada!')
            } else {
                alert(register.message + (register.error ? ': ' + register.error.sqlMessage : ''));
            }

        } catch (error) {
            console.error(error)
            alert('Algo Deu Errado!, Tente Novamente Mais Tarde.')
        }
    });
});
