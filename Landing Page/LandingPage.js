
// Cadastro do Usuário
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
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
            body: JSON.stringify({ nome, email, senha, site }),
        });

        if (createUser.ok) {
            const responseData = await createUser.json(); // Obter resposta em JSON
            alert('Cadastro realizado com sucesso!');
            console.log(responseData);
        } else {
            const errorData = await createUser.json(); // Obter mensagem de erro do backend
            alert('Erro ao cadastrar usuário: ' + errorData.message);
        }

    } catch (error) {
        console.error('Erro ao enviar dados!', error);
        alert('Erro ao realizar cadastro, tente novamente mais tarde.');
    }
});

// Login do Usuário

document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value

    try{
        const loginUser = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })

        })
        if(loginUser.ok){
            const responseData = await loginUser.json(); // Obter resposta em JSON
            console.log(responseData);

            localStorage.setItem('token', responseData.token);

            alert('Login realizado com sucesso! Redirecionando...');
            window.location.href = '/Landing Page/Turmas/Turmas.html';
        }else{
            const errorData = await loginUser.json(); // Obter mensagem de erro do backend
            alert('Não foi possível realizar login: ' + errorData.message);
        }

    }catch{
        console.error('Erro ao enviar dados!', error);
    alert('Erro ao realizar login, tente novamente mais tarde.');
    }


})