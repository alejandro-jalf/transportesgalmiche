const joi = require('joi');

const schemas = (() => {
    
    const schemaEmail = joi.object({
        name: joi.string().min(1).required(),
        phone: joi.string(). required(),
        email: joi.string().min(1).required(),
        body: joi.string().min(1).required()
    });

    return {
        schemaEmail
    }
})();

module.exports = schemas;
