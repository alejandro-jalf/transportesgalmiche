const joi = require('joi');

const General = (() => {
    
    const schemaEmail = joi.object({
        name: joi.string().min(1).required(),
        phone: joi.string(). required(),
        email: joi.string().min(1).required(),
        body: joi.string().min(1).required()
    });

    const schemaOfertaLaboral = joi.object({
        puesto: joi.string().min(1).required(),
        nombre: joi.string().min(1).required(),
        apellidos: joi.string().min(1).required(),
        fecha_nace: joi.string().min(1).required(),
        telefono: joi.string().min(1).required(),
        correo: joi.string().min(1).required(),
        ciudad: joi.string().min(1).required(),
        estado: joi.string().min(1).required(),
        medio: joi.string().min(1).required(),
        link_curriculum: joi.string().min(1).required()
    });

    return {
        schemaEmail,
        schemaOfertaLaboral,
    }
})();

module.exports = General;
