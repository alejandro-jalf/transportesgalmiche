const joi = require('joi');

const Vacantes = (() => {

    const schemaVacante = joi.object({
        puesto_vacante: joi.string().min(1).required(),
        requisitos_vacante: joi.string().min(1).required(),
        disponible_vacante: joi.string().min(1).required(),
        creado_por_vacante: joi.string().min(1).required(),
        alta_vacante: joi.string().min(1).required(),
        modificado_por_vacante: joi.string().min(1).required(),
        modificacion_vacante: joi.string().min(1).required()
    });
    
    const schemaDisponible = joi.object({
        disponible_vacante: joi.string().min(1).required(),
        correo_user: joi.string().min(1).required()
    });

    return {
        schemaVacante,
        schemaDisponible,
    }

})();

module.exports = Vacantes;
