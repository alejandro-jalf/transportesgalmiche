const joi = require('joi');

const Vacantes = (() => {

    const schemaVacante = joi.object({
        puesto_vacante: joi.string().min(1).required(),
        requisitos_vacante: joi.string().min(1).required(),
        disponible_vacante: joi.string().min(1).required()
    });
    
    const schemaDisponible = joi.object({
        disponible_vacante: joi.string().min(1).required()
    });

    return {
        schemaVacante,
        schemaDisponible,
    }

})();

module.exports = Vacantes;
