const Aluno = require('./alunos');
const Turma = require('./turmas');

(async () => {
    const express = require('express');
    const sequelize = require('./db');
    const Usuario = require('./usuarios');
    const Turma = require('./turmas');
    const Aluno = require('./alunos');
    const Boletim = require('./boletim');
    await sequelize.sync(); //cria as tabelas dos models

    const app = express();

    app.use(express.json());

    app.post('/cladastro/usuario', async (req, res) => {
        const {nome, email, senha, site} = req.body;
         try{
            const newUser = await Usuario.create({
                nome,
                email,
                senha,
                site
            });

            res.status(201).json(newUser);
         }catch (error){
            console.error('Erro ao cadastrar usuario:', error);
            res.status(400).send('Erro ao cadastrar usuario');
         }
    });

    app.post('/criar/turma', async (req, res) => {
        const { disciplina, turma, turno, data_inicial, data_final, usuario_id } = req.body;
    
        try {
            const novaTurma = await Turma.create({
                disciplina,
                turma,
                turno,
                data_inicial,
                data_final,
                usuario_id
            });
    
            res.status(201).json(novaTurma);
        } catch (error) {
            console.error('Erro ao cadastrar turma:', error);
            res.status(400).send('Erro ao cadastrar turma: ' + error.message);
        }
    });

    app.post('/aluno', async (req, res) => {
        const {nome} = req.body;
        try{
            const NovoAluno = await Aluno.create({
                nome
            });
            res.status(201).json(NovoAluno);
        }catch (error){
            console.error(error);
            res.status(400).send('Erro ao adicionar aluno');
        }

    })


    app.get('/alunos', async (req, res) => {
        const Alunos = await Aluno.findAll();
        res.json(Alunos);
    })

    


        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

})();