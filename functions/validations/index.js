const vacantes = require('./Vacantes');
const general = require('./General');
const usuarios = require('./Usuarios');

const validations = {
    ...vacantes,
    ...general,
    ...usuarios,
};

module.exports = validations;
