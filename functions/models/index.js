const admin = require("firebase-admin");
admin.initializeApp();

const general = require('./General');
const usuarios = require('./Usuarios');
const vacantes = require('./Vacantes');

const models = {
    ...general,
    ...usuarios,
    ...vacantes,
}

module.exports = models;
