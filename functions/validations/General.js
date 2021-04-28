const { schemaEmail, schemaOfertaLaboral } = require('../schema');
const { createContentAssert, createContentError } = require('../utils');

const General = (() => {
    const validateBodyEmail = (bodyEmail) => {
        let resultValidate = schemaEmail.validate(bodyEmail);
        if( resultValidate.error) {
            return createContentError('Datos del correo no fueron enviados', resultValidate.error.details);
        }
        return createContentAssert('Validacion correcta');
    }

    const validateBodyEmailOfertaLaboral = (bodyEmail) => {
        let resultValidate = schemaOfertaLaboral.validate(bodyEmail);
        if( resultValidate.error) {
            return createContentError('Datos del correo no fueron enviados', resultValidate.error.details);
        }
        return createContentAssert('Validacion correcta');
    }

    return {
        validateBodyEmail,
        validateBodyEmailOfertaLaboral,
    }
})();

module.exports = General;
