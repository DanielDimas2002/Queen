const { DataTypes } = require('sequelize');
const database = require('./db');
const Aluno = require('./alunos');
const Turma = require('./turmas');

const Boletim = database.define('boletim', {
    nota1: DataTypes.FLOAT,
    nota2: DataTypes.FLOAT,
    nota3: DataTypes.FLOAT,
    media: DataTypes.FLOAT,
    situacao: DataTypes.STRING,
});
Boletim.belongsTo(Turma, {foreignKey: 'turma_id'})

Boletim.belongsToMany(Aluno, { through: 'BoletimAluno', foreignKey: 'boletim_id' });
Aluno.belongsToMany(Boletim, { through: 'BoletimAluno', foreignKey: 'aluno_id' });

module.exports = Boletim;