(async () => {

    const database = require('./db');
    const Usuario = require('./usuarios');
    const Turma = require('./turmas');
    const Aluno = require('./alunos');
    const Boletim = require('./boletim');
    const express = require('express');
    const app = express();
    const port = 3001;

    app.use(express.json());

    app.post('/usuarios', async (req, res) => {
        const {nome, email, senha} = req.body;
        try{
            await Usuario.create({
                nome: nome,
                email: email,
                senha: senha,
            });
            res.status(201).send('Usuário Cadastrado');
        }catch (error) {
            console.error(error);
            res.status(500).send('Usuário não cadastrado')
        }
    })

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    })

})