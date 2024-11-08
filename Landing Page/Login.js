// Login do Usuário

document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita o envio padrão do formulário
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    try {
        const loginUser = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });

        if (loginUser.ok) {
            const responseData = await loginUser.json();

            // Armazena o token no localStorage
            localStorage.setItem('token', responseData.token);

            alert('Login realizado com sucesso! Redirecionando...');
            window.location.href = '/Landing Page/Turmas/Turmas.html';
        } else {
            const errorData = await loginUser.json();
            alert('Não foi possível realizar login: ' + errorData.message);
        }
    } catch (error) {
        console.error('Erro ao enviar dados!', error);
        alert('Erro ao realizar login, tente novamente mais tarde.');
    }
});