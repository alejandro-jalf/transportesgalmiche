const  mail = require("mail");
const { password, user } = require('../configs');
const { getDataFirebase } = require("../models");
const { createContentError, createContentAssert, createResponse } = require("../utils");

const services = (() => {

    const getDataConfigFirebase = async () => {
        const response = await getDataFirebase();

        if (!response.success) {
            return createResponse(500, response);
        }

        return createResponse(200, response);
    };
    
    const sendMail =  async () => {
        const prepare = mail.Mail({
            host: 'smtp.gmail.com',
            username: user,
            password
        });

        
        console.log('Estructurando correo');
        const response = await prepare.message({
            from: 'aleflo_1996@outlook.com',
            to: ['alexlofa45@gmail.com'],
            subject: 'Correo de ejemplo'
        })
        .body(`
        Este es un ejmplo de un correo el cual vere si hace multilinia o no
        po eso hice un tab.
        `)
        .send((err) => {
            console.log('Enviando correo in');
            if (err) return createResponse(400, createContentError('Error al enviar el correo', err));
            console.log('Sent! in');
            return createResponse(200, createContentAssert('Correo enviado'));
        });
        console.log('Al fina de la respuesta', response);
        
        console.log('Enviando correo');
        if (response.err) return createResponse(400, createContentError('Error al enviar el correo', err));
        console.log('Sent!');
        return createResponse(200, createContentAssert('Correo enviado'));
    }

    return {
        sendMail,
        getDataConfigFirebase,
    }

})();

module.exports = services;
