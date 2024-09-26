const sequelize = require('sequelize');
const database = require('./db');

const Usuario = database.define('usuario', {
    nome: {
        Type: sequelize.STRING,
        allowNull: false
    },
    email: {
        Type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        Type: sequelize.STRING,
        allowNull: false
    },
    site: {
        Type: sequelize.STRING,
        allowNull: false
    },
});

module.exports = Usuario;