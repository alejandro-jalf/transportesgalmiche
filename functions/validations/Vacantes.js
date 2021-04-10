const { schemaVacante } = require('../schema');
const { createContentAssert, createContentError } = require('../utils');

const Vacantes = (() => {

    const validateBodyVacante = (bodyVacante) => {
        if (!bodyVacante) {
            return createContentError(
                'Se esperaba recivir un objeto y se recivio un valor indefinido',
                bodyVacante
            );
        }

        if (typeof bodyVacante !== 'object') {
            return createContentError(
                'Se esperaba un objeto y se recivio un valor distinto de un objeto',
                bodyVacante
            );
        }

        let resultValidate = schemaVacante.validate(bodyVacante);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera incorrecta", resultValidate.error);
        }

        return createContentAssert("Validacion correcta");
    }

    const validateBodyDisponibleVacante = (bodyVacanteDisponible) => {
        if (!bodyVacanteDisponible) {
            return createContentError(
                'Se esperaba recivir un objeto y se recivio un valor indefinido',
                bodyVacanteDisponible
            );
        }

        if (typeof bodyVacanteDisponible !== 'object') {
            return createContentError(
                'Se esperaba un objeto y se recivio un valor distinto de un objeto',
                bodyVacanteDisponible
            );
        }

        let resultValidate = schemaVacante.validate(bodyVacanteDisponible);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera incorrecta", resultValidate.error);
        }

        return createContentAssert("Validacion correcta");
    }
    
    return {
        validateBodyVacante,
        validateBodyDisponibleVacante,
    }

})();

module.exports = Vacantes;
