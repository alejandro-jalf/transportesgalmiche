const functions = require('firebase-functions');
require("mandatoryenv").load();

const token = (functions.config().token) ? functions.config().token.key : process.env.TRANSPORTES_TOKEN;
const origin1 = (functions.config().origin1) ? functions.config().origin1.key : process.env.TRANSPORTES_ORIGIN1;
const origin2 = (functions.config().origin2) ? functions.config().origin2.key : process.env.TRANSPORTES_ORIGIN2
const origin3 = (functions.config().origin3) ? functions.config().origin3.key : process.env.TRANSPORTES_ORIGIN3
const user = (functions.config().user) ? functions.config().user.key : process.env.TRANSPORTES_USER;
const password = (functions.config().password) ? functions.config().password.key : process.env.TRANSPORTES_PASSWORD;

module.exports = {
    token,
    listOriginAccept: [
        origin1,
        origin2,
        origin3,
    ],
    user,
    password,
}
