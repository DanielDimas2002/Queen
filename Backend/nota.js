const { DataTypes } = require('sequelize');
const database = require('./db');
const Boletim = require('./boletim');

const Nota = database.define('nota', {
    valor: DataTypes.FLOAT, // Valor da nota
    tipo: DataTypes.STRING, // Tipo da avaliação (ex.: Prova 1, Trabalho 2)
});

Nota.belongsTo(Boletim, { foreignKey: 'boletim_id', onDelete: 'CASCADE' });
Boletim.hasMany(Nota, { foreignKey: 'boletim_id' });

module.exports = Nota;
