const { schemaEmail } = require('../schema');
const { createContentAssert, createContentError } = require('../utils');

const validations = (() => {
    const validateBodyEmail = (bodyEmail) => {
        let resultValidate = schemaEmail.validate(bodyEmail);
        if( resultValidate.error) {
            return createContentError('Datos del correo no fueron enviados', resultValidate.error.details);
        }
        return createContentAssert('Validacion correcta');
    }

    return {
        validateBodyEmail,
    }
})();

module.exports = validations;
