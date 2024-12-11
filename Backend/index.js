
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
        console.log(`Buscando dados para a turma com ID: ${turmaId}`);
        // Busca a turma para obter o número de avaliações
        const turma = await Turma.findOne({
            where: { id: turmaId },
            attributes: ['qtd_avaliacoes'], // Inclui apenas o campo qtd_avaliacoes
        });

        if (!turma) {
            console.error(`Turma com ID ${turmaId} não encontrada.`);
            return res.status(404).json({ message: 'Turma não encontrada.' });
        }

        console.log(`Turma encontrada. Quantidade de avaliações: ${turma.qtd_avaliacoes}`);

        // Busca os alunos da turma com seus boletins e notas associadas
        const alunos = await Aluno.findAll({
            where: { turma_id: turmaId },
            include: [
                {
                    model: Boletim, // Inclui os boletins associados
                    attributes: ['id'], // Inclui apenas o ID do boletim
                    include: {
                        model: Nota, // Inclui as notas associadas ao boletim
                        attributes: ['valor', 'tipo'], // Inclui os valores e tipos das notas
                    },
                },
            ],
        });

        if (alunos.length === 0) {
            console.warn('Nenhum aluno encontrado para a turma.');
        }

        // Manipula os dados para estruturar as notas dinamicamente
        const alunosComNotas = alunos.map(aluno => {
            const boletim = aluno.boletim;
            
            // Verifica se existem notas e mapeia
            const notas = boletim && boletim.notas ? boletim.notas.reduce((acc, nota, index) => {
                acc[`nota${index + 1}`] = nota.valor; // Adiciona as notas dinamicamente
                return acc;
            }, {}) : {}; // Caso não haja notas, retorna um objeto vazio

            return {
                ...aluno.toJSON(),
                boletim: {
                    ...boletim.toJSON(),
                    ...notas, // Adiciona as notas no boletim do aluno
                },
            };
        });

        console.log(`Alunos encontrados: ${alunosComNotas.length}`);
        res.status(200).json({
            alunos: alunosComNotas,
            qtd_avaliacoes: turma.qtd_avaliacoes, // Retorna a quantidade de avaliações
        });
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        res.status(500).json({ message: 'Erro interno ao buscar alunos.' });
    }
});





app.put('/definirMedia', async (req, res) => {
    const { turmaId, novaMedia, numeroDeAvaliacoes, notaRecuperacao } = req.body;

    console.log('Dados recebidos no backend:', { turmaId, novaMedia, numeroDeAvaliacoes, notaRecuperacao });

    try {
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

        // Lógica para atualizar os boletins de todos os alunos dessa turma
        const alunosDaTurma = await Aluno.findAll({ where: { turma_id: turmaId } });

        for (const aluno of alunosDaTurma) {
            const boletim = await Boletim.findOne({ where: { aluno_id: aluno.id } });

            if (boletim) {
                // Obtemos a quantidade atual de avaliações
                const qtdAvaliacoesAtual = await Nota.count({ where: { boletim_id: boletim.id } });

                if (qtdAvaliacoesAtual < numeroDeAvaliacoes) {
                    // Se o número de avaliações foi aumentado, adicionamos novas avaliações
                    for (let i = qtdAvaliacoesAtual + 1; i <= numeroDeAvaliacoes; i++) {
                        const nota = await Nota.create({
                            valor: 0, // Ou valor inicial desejado
                            tipo: `Avaliacao ${i}`,
                            boletim_id: boletim.id,
                        });
                        console.log("Nota criada:", nota);
                    }
                } else if (qtdAvaliacoesAtual > numeroDeAvaliacoes) {
                    // Se o número de avaliações foi diminuído, removemos as avaliações extras
                    const notasExtras = await Nota.findAll({ where: { boletim_id: boletim.id }, order: [['createdAt', 'DESC']], limit: qtdAvaliacoesAtual - numeroDeAvaliacoes });

                    for (const nota of notasExtras) {
                        await nota.destroy();
                    }
                }

                // Atualiza o boletim
                const notasAtualizadas = await Nota.findAll({ where: { boletim_id: boletim.id } });
                boletim.notas = notasAtualizadas.map(nota => nota.valor); // Atualiza as notas com os valores corretos

                // Atualiza a média e a situação do aluno
                boletim.situacao = novaMedia >= notaRecuperacao ? 'Aprovado' : 'Reprovado';

                try {
                    await boletim.save(); // Salva o boletim
                    console.log(`Boletim do aluno ${aluno.id} atualizado com sucesso.`);
                } catch (err) {
                    console.error('Erro ao salvar o boletim:', err);
                    return res.status(500).json({ message: 'Erro ao salvar o boletim.' });
                }
            } else {
                // Caso o boletim não exista, cria um boletim novo para o aluno
                await Boletim.create({
                    aluno_id: aluno.id,
                    notas: Array(numeroDeAvaliacoes).fill(null), // Cria um boletim com o número correto de notas vazias
                    media: novaMedia,
                    situacao: novaMedia >= notaRecuperacao ? 'Aprovado' : 'Reprovado',
                });
                console.log(`Boletim do aluno ${aluno.id} criado com sucesso.`);
            }
        }

        // Salva as alterações na turma
        await turma.save();

        res.status(200).json({ message: 'Pré-definições e boletins salvos com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar pré-definições e boletins:', error);
        res.status(500).json({ message: 'Erro ao salvar pré-definições e boletins.' });
    }
});

// Endpoint GET para retornar os dados da turma
app.get('/obterMediaTurma/:turmaId', async (req, res) => {
    const { turmaId } = req.params;

    try {
        const turma = await Turma.findByPk(turmaId);
        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada.' });
        }

        // Retorna os dados da turma
        res.status(200).json({
            media: turma.media,
            qtd_avaliacoes: turma.qtd_avaliacoes,
            recuperacao: turma.recuperacao
        });
    } catch (error) {
        console.error('Erro ao buscar dados da turma:', error);
        res.status(500).json({ message: 'Erro ao buscar dados da turma.' });
    }
});

app.post('/api/notas', async (req, res) => {
    const { valor, tipo, alunoId, boletimId } = req.body;

    try {
        // Verifica se o boletim e o aluno existem
        const boletim = await Boletim.findOne({ where: { id: boletimId, aluno_id: alunoId } });
        if (!boletim) {
            return res.status(404).json({ error: 'Boletim não encontrado para o aluno.' });
        }

        // Cria ou atualiza a nota
        const nota = await Nota.create({
            valor,
            tipo,
            boletim_id: boletim.id,
        });

        res.status(201).json({ message: 'Nota salva com sucesso!', nota });
    } catch (error) {
        console.error('Erro ao salvar a nota:', error);
        res.status(500).json({ error: 'Erro ao salvar a nota no banco de dados.' });
    }
});

app.put('/atualizarNota', async (req, res) => {
    const { nomeAluno, tipoAvaliacao, valor } = req.body;

    try {
        // Passo 1: Encontrar o aluno
        const aluno = await Aluno.findOne({
            where: { nome: nomeAluno }
        });

        if (!aluno) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        // Passo 2: Encontrar o boletim do aluno
        const boletim = await Boletim.findOne({
            where: { aluno_id: aluno.id }
        });

        if (!boletim) {
            return res.status(404).json({ message: "Boletim não encontrado" });
        }

        // Passo 3: Encontrar a avaliação dentro do boletim
        const nota = await Nota.findOne({
            where: { boletim_id: boletim.id, tipo: tipoAvaliacao }
        });

        if (!nota) {
            return res.status(404).json({ message: "Nota de avaliação não encontrada" });
        }

        // Passo 4: Atualizar o valor da nota
        nota.valor = valor;
        await nota.save();

        return res.status(200).json({ message: "Nota atualizada com sucesso" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});







    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

})();
