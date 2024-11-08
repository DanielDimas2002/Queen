const { DataTypes } = require('sequelize'); 
const database = require ('./db');

const Usuario = database.define('usuario', {
    nome: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Usuario;