const sequelize = require('sequelize');
const database = require('./db');
const Turma = require('./turmas');

const Aluno = database.define('aluno', {
    nome: {
        type: sequelize.STRING,
        allowNull: false,
    },
});
Alunos.belongsTo(Turma, { foreignKey: 'turma_id'});


module.exports = Aluno;