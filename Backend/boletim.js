const { DataTypes } = require('sequelize');
const database = require('./db');
const Aluno = require('./alunos');

const Boletim = database.define('boletim', {
    media: DataTypes.FLOAT,
    situacao: DataTypes.STRING,
    recuperacao: DataTypes.FLOAT,
});

Boletim.belongsTo(Aluno, { foreignKey: 'aluno_id', onDelete: 'CASCADE' }); // Associa o boletim a um aluno
Aluno.hasOne(Boletim, { foreignKey: 'aluno_id' }); // Um aluno pode ter apenas um boletim

module.exports = Boletim;
