
// Cadastro do Usuário
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('formCadastro');

    const nome = document.getElementById('nome').value;
    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const site = document.getElementById('site').value;

    // Confirma se as senhas correspondem
    const confirmSenha = document.getElementById('confirmSenha').value;
    if (senha !== confirmSenha) {
        alert('As senhas não correspondem!');
        return;
    }

    try {
        const createUser = await fetch('http://localhost:3000/cadastro/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome,usuario, email, senha, site }),
        });

        if (createUser.ok) {
            const responseData = await createUser.json();
            alert('Cadastro realizado com sucesso!');
            console.log(responseData);
            form.reset();
        } else {
            const errorData = await createUser.json();
            alert('Erro ao cadastrar usuário: ' + errorData.message);
        }
    } catch (error) {
        console.error('Erro ao enviar dados!', error);
        alert('Erro ao realizar cadastro, tente novamente mais tarde.');
    }
});


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


// Chame a função fetchProtectedData em um lugar apropriado após o login
// Você pode querer fazer isso em outra parte do seu código após redirecionar para a nova página.
