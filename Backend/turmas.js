const {DataTypes} = require('sequelize');
const database = require ('./db');
const Usuario = require('./usuarios');

const Turma = database.define('turma', {
    disciplina: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      turma: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      turno: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      qtd_avaliacoes: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 3,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recuperacao: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data_inicial: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      data_final: {
        type: DataTypes.DATE,
        allowNull: false,
      },
});
Turma.belongsTo(Usuario, { foreignKey: 'usuario_id'})

module.exports = Turma;