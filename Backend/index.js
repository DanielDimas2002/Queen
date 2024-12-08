
(async () => {
    const express = require('express');
    const sequelize = require('./db');
    const Usuario = require('./usuarios');
    const Turma = require('./turmas');
    const Aluno = require('./alunos');
    const Boletim = require('./boletim');
    const Nota = require('./nota')
    
    const cors = require('cors')
    await sequelize.sync(); //cria as tabelas dos models

    const app = express();

    app.use(express.json());
    app.use(cors()); // Para permitir que o backend seja acessado pelo frontend

    // Cadastro dos Usuários
    app.post('/cadastro/usuario', async (req, res) => {
        console.log(req.body); // Depurando o corpo da requisição
        const { nome, email, senha } = req.body;
    
        if (!nome || !email || !senha) { //Verifica se todos os campos estão preenchidos
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
        }
    
        const usuarioExistente = await Usuario.findOne({ where: { email } }); // Analisa se o email já está cadastrado
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já está em uso.' });
        }
    
        try {
            const newUser = await Usuario.create({
                nome,
                email,
                senha
            });
    
            res.status(201).json({ message: 'Usuário Cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(400).json({ message: 'Erro ao cadastrar usuário', error: error.message });
        }
    });


    // Login dos Usuários

    const jwt = require('jsonwebtoken');
    const secretKey = process.env.JWT_SECRET_KEY || 'Salmos23';
    const bcrypt = require('bcrypt');

    app.post('/login', async (req, res) => {
        const { email, senha } = req.body;
    
        console.log('Tentando fazer login com:', email, senha); // Logando email e senha
    
        if (!email || !senha) {
            return res.status(400).json({ message: 'Preencha todos os campos!' });
        }
    
        try {
            // Buscando o usuário no banco de dados
            const usuario = await Usuario.findOne({ where: { email } });
            console.log('Usuário encontrado:', usuario); // Logando o usuário encontrado
    
            if (!usuario) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }
    
            // Verifica se a senha é igual à senha do usuário encontrado
            if (senha !== usuario.senha) { // Comparando diretamente as senhas em texto claro
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }
    
            // Gera o token após a validação bem-sucedida
            const token = jwt.sign({ id: usuario.id }, secretKey, { expiresIn: '1d' });
    
            res.status(200).json({
                message: 'Login realizado com sucesso!',
                usuario: { nome: usuario.nome, email: usuario.email },
                token
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ message: 'Erro ao fazer login.' });
        }
    });
    
    

    // Middleware de autenticação
    const autenticar = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
        }

        jwt.verify(token, secretKey, (err, usuario) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido ou expirado.' });
            }
            req.usuario = usuario; // Salva informações do usuário no request
            next(); // Chama a próxima função (ou rota)
        });
    };

// Rota protegida
    app.get('/protected-route', autenticar, (req, res) => {
        res.json({ message: 'Bem-vindo à rota protegida!', user: req.usuario });
    });

    

    app.post('/criarTurma', async (req, res) => {
        const { disciplina, turma, turno, data_inicial, data_final } = req.body;
    
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido.' });
        }
    
        try {
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded.id;
    
            const novaTurma = await Turma.create({
                disciplina,
                turma,
                turno,
                data_inicial,
                data_final,
                usuario_id: userId
            });
    
            res.status(201).json(novaTurma);
        } catch (error) {
            console.error('Erro ao cadastrar turma:', error);
            res.status(400).json({ message: 'Erro ao cadastrar turma', error: error.message });
        }
    });
    

    // Rota para buscar todas as turmas
app.get('/turmas', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id;

        // Buscar turmas do banco de dados associadas ao usuário
        const turmas = await Turma.findAll({
            where: {
                usuario_id: userId // Filtrar turmas pelo ID do usuário
            }
        });

        res.status(200).json(turmas);
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        res.status(500).send('Erro ao buscar turmas: ' + error.message);
    }
});

app.get('/turmas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const turma = await db.query('SELECT * FROM turmas WHERE id = ?', [id]);
        if (turma.length === 0) {
            return res.status(404).json({ message: 'Turma não encontrada.' });
        }
        res.json(turma[0]);
    } catch (error) {
        console.error('Erro ao buscar turma:', error);
        res.status(500).json({ message: 'Erro ao buscar turma.' });
    }
});


app.post('/alunos', async (req, res) => {
    const { nomes, turmaId } = req.body;

    if (!Array.isArray(nomes) || nomes.length === 0) {
        console.error("Nomes não são um array válido ou estão vazios");
        return res.status(400).json({ message: 'Nomes devem ser um array não vazio!' });
    }

    if (!turmaId || isNaN(turmaId)) {
        console.error("ID da turma inválido:", turmaId);
        return res.status(400).json({ message: 'ID da turma é inválido!' });
    }

    try {
        const turma = await Turma.findByPk(turmaId);
        if (!turma) {
            console.error("Turma não encontrada para o ID:", turmaId);
            return res.status(404).json({ message: 'Turma não encontrada!' });
        }

        const qtdAvaliacoes = turma.qtd_avaliacoes;
        if (!qtdAvaliacoes || qtdAvaliacoes <= 0) {
            console.error("Quantidade de avaliações inválida:", qtdAvaliacoes);
            return res.status(400).json({ message: 'Quantidade de avaliações inválida!' });
        }

        const alunosCriados = [];
        for (const nome of nomes) {
            const aluno = await Aluno.create({ nome, turma_id: turmaId });
            console.log("Aluno criado:", aluno);

            const boletim = await Boletim.create({
                media: 0,
                situacao: 'Pendente',
                aluno_id: aluno.id,
            });
            console.log("Boletim criado para aluno:", boletim);

            for (let i = 1; i <= qtdAvaliacoes; i++) {
                const nota = await Nota.create({
                    valor: 0,
                    tipo: `Avaliacao ${i}`,
                    boletim_id: boletim.id,
                });
                console.log("Nota criada:", nota);
            }

            alunosCriados.push(aluno);
        }

        res.status(201).json(alunosCriados);
    } catch (error) {
        console.error("Erro ao cadastrar alunos:", error);
        res.status(500).json({ message: 'Erro interno ao salvar alunos.' });
    }
});





app.get('/turmas/:turmaId/alunos', async (req, res) => {
    const { turmaId } = req.params;

    try {
        // Busca os alunos da turma com seus boletins associados
        const alunos = await Aluno.findAll({
            where: { turma_id: turmaId },
            include: {
                model: Boletim, // Inclui os boletins associados
                attributes: ['nota1', 'nota2', 'nota3', 'media', 'situacao'],
            },
        });

        res.status(200).json(alunos);
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        res.status(500).json({ message: 'Erro interno ao buscar alunos.' });
    }
});

app.put('/definirMedia', async (req, res) => {
    const { turmaId, novaMedia, numeroDeAvaliacoes, notaRecuperacao } = req.body;

    console.log('Dados recebidos no backend:', { turmaId, novaMedia, numeroDeAvaliacoes, notaRecuperacao });

    try {
        // Verifica se os dados necessários foram enviados
        if (!turmaId || novaMedia === undefined || numeroDeAvaliacoes === undefined || notaRecuperacao === undefined) {
            return res.status(400).json({ message: 'Faltam dados necessários para atualizar a turma.' });
        }

        // Busca a turma no banco de dados usando o ID
        const turma = await Turma.findByPk(turmaId);
        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada.' });
        }

        // Atualiza os valores na turma
        turma.media = novaMedia;
        turma.qtd_avaliacoes = numeroDeAvaliacoes;
        turma.recuperacao = notaRecuperacao;

        // Salva as alterações no banco de dados
        await turma.save();

        // Retorna sucesso
        res.status(200).json({ message: 'Pré-definições salvas com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar pré-definições:', error);
        res.status(500).json({ message: 'Erro ao salvar pré-definições.' });
    }
})


    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

})();
