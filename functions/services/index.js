const  mail = require("nodemailer");
const { password, user } = require('../configs');
const { getDataFirebase } = require("../models");
const { createContentError, createContentAssert, createResponse } = require("../utils");
const { validateBodyEmail } = require("../validations");

const services = (() => {

    const getDataConfigFirebase = async () => {
        const response = await getDataFirebase();

        if (!response.success) {
            return createResponse(500, response);
        }

        return createResponse(200, response);
    };
    
    const sendMail =  async (bodyEmail) => {

        const resultValidate = validateBodyEmail(bodyEmail);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        const { name, body, email , phone } = bodyEmail;

        const transporter = mail.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user,
                pass: password,
            },
        });

        try {
            const info = await transporter.sendMail({
                from: '"Pagina Oficial" <transportesgalmiche.servicio>',
                to: "atencionalcliente@transportesgalmiche.com",
                subject: "Solicitud de informacion",
                html: `
                <h1>Se enviado una solicitud de informacion de cliente</h1>
                <h2>Datos del Cliente:</h2>
                <b>Nombre: </b> ${name} <br>
                <b>Telefono de contacto: </b> ${phone} <br>
                <b>Correo de Contacto: </b> ${email} <br>
                <b>Contenido del mensaje: </b> <br> ${body} <br>
                `
            });
            
            console.log('Al fina de la respuesta', info);
            return createResponse(200, createContentAssert('Correo enviado'));
        } catch (error) {
            console.log(error);
            return createResponse(400, createContentError('Error al enviar el correo', error));
        }
    }

    return {
        sendMail,
        getDataConfigFirebase,
    }

})();

module.exports = services;
