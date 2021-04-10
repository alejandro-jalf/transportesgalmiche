const { sendEmail , createResponse } = require("../utils");
const { validateBodyEmail } = require("../validations");
const {
    getDataFirebase,
} = require("../models");

const General = (() => {

    const getDataConfigFirebase = async () => {
        const response = await getDataFirebase();

        if (!response.success) {
            return createResponse(500, response);
        }

        return createResponse(200, response);
    };
    
    const requestInformation =  async (bodyEmail) => {

        const resultValidate = validateBodyEmail(bodyEmail);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        const { name, body, email , phone } = bodyEmail;

        const content = `
            <h1>Se enviado una solicitud de informacion de cliente</h1>
            <h2>Datos del Cliente:</h2>
            <b>Nombre: </b> ${name} <br>
            <b>Telefono de contacto: </b> ${phone} <br>
            <b>Correo de Contacto: </b> ${email} <br>
            <b>Contenido del mensaje: </b> <br> ${body} <br>
            `;

        const responseEmail = await sendEmail('atencionalcliente@transportesgalmiche.com', 'Solicitud de informacion', content);
        
        if (!responseEmail.success) {
            return createResponse(500, responseEmail);
        }

        return createResponse(200, responseEmail);
    }

    return {
        requestInformation,
        getDataConfigFirebase,
    }

})();

module.exports = General;
