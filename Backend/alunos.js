const { DataTypes } = require('sequelize');
const database = require('./db');
const Turma = require('./turmas');

const Aluno = database.define('aluno', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Aluno.belongsTo(Turma, { foreignKey: 'turma_id', onDelete: 'CASCADE' }); // Associa o aluno a uma turma
Turma.hasMany(Aluno, { foreignKey: 'turma_id' }); // Uma turma pode ter vários alunos

module.exports = Aluno;
