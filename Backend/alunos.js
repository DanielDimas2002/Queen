const { DataTypes } = require('sequelize');
const database = require('./db');
const Turma = require('./turmas');

const Aluno = database.define('aluno', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
Aluno.belongsToMany(Turma, { through: 'AlunoTurma', foreignKey: 'aluno_id'});
Turma.belongsToMany(Aluno, { through: 'AlunoTurma', foreignKey: 'turma_id'})


module.exports = Aluno;