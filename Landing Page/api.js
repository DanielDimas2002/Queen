const { error } = require("console");

const API_URL = 'http://localhost:3001/usuarios'

document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmSenha = document.getElementById('confirmSenha').value;
    const telefone = document.getElementById('telefone').value;
    const site = document.getElementById('site').value;

    if(senha != confirmSenha){
        alert('Senhas não coincidem!');
        return;
    }

    try{
        const createUser = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                email,
                senha,
                telefone,
                site
            })
        });

        if(createUser.ok){
            alert('Usuário cadastrado com sucesso!')
            document.getElementById('FormCadastro').reset();

        }else{
            const errorData = await createUser.json();
            alert(`Erro ao cadastrar: ${errorData.message}`)
        }
    }catch{
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao enviar dados para o servidor');
    }


})