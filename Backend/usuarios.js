const { DataTypes } = require('sequelize'); // Corrigido: Importa DataTypes corretamente
const database = require('./db'); // Certifique-se de que está importando a conexão correta com o banco

const Usuario = database.define('usuario', {
    nome: {
        type: DataTypes.STRING, // Corrigido: 'type' com "t" minúsculo
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
    site: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Usuario;