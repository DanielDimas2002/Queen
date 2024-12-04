const { DataTypes } = require('sequelize');
const database = require('./db');
const Aluno = require('./alunos');

const Boletim = database.define('boletim', {
    nota1: DataTypes.FLOAT,
    nota2: DataTypes.FLOAT,
    nota3: DataTypes.FLOAT,
    media: DataTypes.FLOAT,
    situacao: DataTypes.STRING,
});

Boletim.belongsTo(Aluno, { foreignKey: 'aluno_id', onDelete: 'CASCADE' }); // Associa o boletim a um aluno
Aluno.hasOne(Boletim, { foreignKey: 'aluno_id' }); // Um aluno pode ter apenas um boletim

module.exports = Boletim;
