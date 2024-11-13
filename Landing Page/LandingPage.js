
// Cadastro do Usuário
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('formCadastro');

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

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
            body: JSON.stringify({ nome, email, senha }),
        });

        if (createUser.ok) {
            const responseData = await createUser.json();
            alert('Cadastro realizado com sucesso!');
            console.log(responseData);
            window.location.href = "Login.html";
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





// Chame a função fetchProtectedData em um lugar apropriado após o login
// Você pode querer fazer isso em outra parte do seu código após redirecionar para a nova página.
