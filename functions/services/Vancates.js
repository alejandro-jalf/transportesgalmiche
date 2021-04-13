const { createResponse, configureNameEmail, } = require("../utils");
const { validateBodyVacante, } = require("../validations");
const {
    getAllVacantes,
    getVacanteByName,
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

    const createVacante = async (bodyVacantes) => {
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

    return {
        getAllVacancies,
        createVacante,
    }
})();

module.exports = Vacantes;
