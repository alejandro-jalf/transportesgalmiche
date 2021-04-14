const vacantes = require('./Vacantes')
const general = require('./General')
const usuarios = require('./Usuarios')

const services = {
    ...vacantes,
    ...general,
    ...usuarios,
};

module.exports = services;
