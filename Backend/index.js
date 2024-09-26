(async () => {
    const express = require('express');
    const app = express();
    const sequelize = require('./db');
    const Usuario = require('./usuarios');

    try{
        await sequelize.sync({ force: false });
        console.log('Tabelas Criadas');
    }catch{
        console.error('Erro ao criar tabelas')
    }

    app.get('/usuarios', (req, res) => {
        console.log('GET USUARIOS');
        res.json('kk');
    })

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

        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

})();