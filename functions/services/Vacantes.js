const { createResponse, configureNameEmail, } = require("../utils");
const {
    validateBodyVacante,
    validateBodyDisponibleVacante,
} = require("../validations");
const {
    getAllVacantes,
    getVacanteByName,
    updateVacante,
    deleteVacante,
} = require("../models");
const vacantes = require("../models/Vacantes");

const Vacantes = (() => {

    const getAllVacancies = async () => {
        const result = await getAllVacantes();

        if (result.message === 'Error al consultar la base de datos') {
            return createResponse(500, result);
        }

        const vacantes_disponibles = 0;

        result.data.vacantes_disponibles = vacantes_disponibles;

        return createResponse(200, result);
    }

    const createVacancy = async (bodyVacantes) => {
        const resultValidate = validateBodyVacante(bodyVacantes);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        const puesto_vacante = configureNameEmail(bodyVacantes.puesto_vacante);
        const existVacante = await getVacanteByName(puesto_vacante);
        if (existVacante.message === "Error al consultar la base de datos") {
            return createResponse(500, existVacante);
        }

        if (existVacante.success) {
            return createResponse(200, createContentError(`El puesto "${bodyVacantes.puesto_vacante}" ya esta registrado`, {}));
        }

        const response = await createUser(puesto_vacante, bodyVacantes);

        if(!response.success) return createResponse(500, response);

        return createResponse(201, response);
    }

    const updateAvailableVacancy = async (puesto_vacante, bodyVacantes) => {
        const resultValidate = validateBodyDisponibleVacante(bodyVacantes);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        puesto_vacante = configureNameEmail(puesto_vacante);
        const existVacante = await getVacanteByName(puesto_vacante);
        if (existVacante.message === "Error al consultar la base de datos") {
            return createResponse(500, existVacante);
        }
        
        if (!existVacante.success) {
            return createResponse(200, existVacante);
        }

        if (existVacante.data.disponible_vacante === bodyVacantes.disponible_vacante) {
            return createResponse(
                200,
                createContentError("El estatus de disponible_vacante es igual", {})
            );
        }

        const newActivoVacante = bodyVacantes.disponible_vacante;
        bodyVacantes = existVacante.data;
        bodyVacantes.disponible_vacante = newActivoVacante;
        const response = await updateVacante(puesto_vacante, bodyVacantes);
        
        if(!response.success) return createResponse(500, response);

        const tipo_activo = newActivoVacante ? 'Disponible' : 'Ocupado';
        
        response.message = "Se a cambiado el estatus de la vacante a: " + tipo_activo;
        return createResponse(200, response);
    }

    const updateVacancy = async (puesto_vacante, bodyVacantes) => {
        const resultValidate = validateBodyVacante(bodyVacantes);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        puesto_vacante = configureNameEmail(puesto_vacante);
        const existVacante = await getVacanteByName(puesto_vacante);
        if (existVacante.message === "Error al consultar la base de datos") {
            return createResponse(500, existVacante);
        }
        
        if (!existVacante.success) {
            return createResponse(200, existVacante);
        }

        const response = await updateVacante(puesto_vacante, bodyVacantes);
        
        if(!response.success) return createResponse(500, response);
        
        response.message = "Datos de la vacante actualizados";
        return createResponse(200, response);
    }

    const deleteVacancy = async (puesto_vacante) => {
        puesto_vacante = configureNameEmail(puesto_vacante);
        const existVacante = await getVacanteByName(puesto_vacante);
        if (existVacante.message === "Error al consultar la base de datos") {
            return createResponse(500, existVacante);
        }
        
        if (!existVacante.success) {
            return createResponse(200, existVacante);
        }
        
        const responseDelete = await deleteVacante(puesto_vacante);
        if(!responseDelete.success) return createResponse(500, responseDelete);
        
        responseDelete.message = `La vacante para el puesto de "${puesto_vacante}" ha sido eliminada`;
        return createResponse(200, responseDelete);
    }

    return {
        getAllVacancies,
        createVacancy,
        updateAvailableVacancy,
        updateVacancy,
        deleteVacancy,
    }
})();

module.exports = Vacantes;
