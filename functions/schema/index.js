const vacantes = require('./Vacantes');
const general = require('./General');
const usuarios = require('./Usuarios');

const schemas = {
    ...vacantes,
    ...general,
    ...usuarios,
};

module.exports = schemas;
