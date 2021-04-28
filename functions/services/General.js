const { sendEmail , createResponse } = require("../utils");
const { validateBodyEmail, validateBodyEmailOfertaLaboral } = require("../validations");
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
            <h1>Ha recibido una solicitud de informacion de cliente</h1>
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

    const sendDataLaboral =  async (bodyEmail) => {
        const resultValidate = validateBodyEmailOfertaLaboral(bodyEmail);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        const { 
            puesto,
            nombre,
            apellidos,
            fecha_nace,
            telefono,
            correo,
            ciudad,
            estado,
            medio,
            link_curriculum
        } = bodyEmail;

        let content = `
            <h1>Ha recibido una solicitud de empleo</h1>
            <h2>Datos Recividos:</h2>
            <b>Puesto solicitado: </b> ${puesto} <br>
            <b>Nombre Completo: </b> ${nombre} ${apellidos} <br>
            <b>Fecha de nacimiento: </b> ${fecha_nace} <br>
            <b>Telefono de contacto: </b> ${telefono} <br>
            <b>Correo de contacto: </b> ${correo} <br>
            <b>Estado: </b> ${estado} <br>
            <b>Ciudad: </b> ${ciudad} <br>
            <b>Como se entero el solicitante: </b> Por medio de ${medio} <br>
            `;
        
        const curriculum = (link_curriculum === "empty")
            ? "<b>Curriculum vitae: </b>🥺 El solicitante no envio el curriculum"
            : `
                <b>Curriculum vitae: </b>
                <a href="${link_curriculum}" target="_blank" download="cv - ${nombre} ${apellidos}">
                    Decargar curriculum aqui
                </a> <br>
            `;
        
        content += curriculum;

        const responseEmail = await sendEmail('administracion@transportesgalmiche.com', 'Solicitud de empleo', content);
        
        if (!responseEmail.success) {
            return createResponse(500, responseEmail);
        }

        return createResponse(200, responseEmail);
    }

    return {
        requestInformation,
        getDataConfigFirebase,
        sendDataLaboral,
    }

})();

module.exports = General;
