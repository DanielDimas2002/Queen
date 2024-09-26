const sequelize = require('sequelize');
const database = require('./db');
const Aluno = require('./alunos');
const Turma = require('./turmas');

const Boletim = database.define('boletim', {
    nota1: sequelize.FLOAT,
    nota2: sequelize.FLOAT,
    nota3: sequelize.FLOAT,
    media: sequelize.FLOAT,
    situacao: sequelize.STRING,
});
Boletim.belongsTo(Turma, {foreingKey: 'turma_id'})
Boletim.belongsTo(Aluno, {foreingKey: 'aluno_id'})

module.exports = Boletim;