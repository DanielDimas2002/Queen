const sequelize = require('sequelize');
const database = require ('./db');

const Turma = database.define('turma', {
    disciplina: {
        type: sequelize.STRING,
        allowNull: false,
      },
      turma: {
        type: sequelize.STRING,
        allowNull: false,
      },
      turno: {
        type: sequelize.STRING,
        allowNull: false,
      },
      data_inicial: {
        type: sequelize.DATE,
        allowNull: false,
      },
      data_final: {
        type: sequelize.DATE,
        allowNull: false,
      },
});

module.exports = Turma;