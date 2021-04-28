const { createResponse, configureNameEmail, createContentError } = require("../utils");
const {
    validateBodyVacante,
    validateBodyDisponibleVacante,
} = require("../validations");
const {
    getAllVacantes,
    getVacanteByName,
    createVacante,
    updateVacante,
    deleteVacante,
} = require("../models");

const Vacantes = (() => {

    const getAllVacancies = async () => {
        const result = await getAllVacantes();

        if (result.message === 'Error al consultar la base de datos') {
            return createResponse(500, result);
        }

        if (!result.success) {
            return createResponse(200, result)
        }

        const listVacantes = result.data;
        result.data = {};

        result.data.listVacantes = listVacantes;
        result.data.vacantes_disponibles = Object.values(listVacantes).reduce(
            (contadorVacantes, vacante) => {
                if (vacante.disponible_vacante) contadorVacantes ++;
                return contadorVacantes;
            }
        , 0);

        return createResponse(200, result);
    }

    const getVancantesDisponibles = async () => {
        const result = await getAllVacantes();

        if (result.message === 'Error al consultar la base de datos') {
            return createResponse(500, result);
        }

        if (!result.success) {
            return createResponse(200, result)
        }

        const listVacantes = Object.values(result.data);
        let vacantes_disponibles = 0;

        result.data = {};

        result.data.listVacantes = listVacantes.reduce(
            (acumVacantes, vacante) => {
                if (vacante.disponible_vacante) {
                    acumVacantes[`${vacante.puesto_vacante}`] = vacante;
                    vacantes_disponibles ++;
                }
                
                    return acumVacantes
            }, {}
        );
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

        const response = await createVacante(puesto_vacante.toLowerCase(), bodyVacantes);

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
        const modificado_por = bodyVacantes.correo_user;
        const modificacion = bodyVacantes.modificacion_vacante;

        bodyVacantes = existVacante.data;
        bodyVacantes.disponible_vacante = newActivoVacante;
        bodyVacantes.modificado_por_vacante = modificado_por;
        bodyVacantes.modificacion_vacante = modificacion;
        const response = await updateVacante(puesto_vacante.toLowerCase(), bodyVacantes);
        
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

        if (puesto_vacante.toLowerCase().trim() !== bodyVacantes.puesto_vacante.toLowerCase().trim()) {
            const new_puesto_vacante = configureNameEmail(bodyVacantes.puesto_vacante);
            const existVacante = await getVacanteByName(new_puesto_vacante);
            if (existVacante.message === "Error al consultar la base de datos") {
                return createResponse(500, existVacante);
            }
            
            if (existVacante.success) {
                return createResponse(200, createContentError(
                    "Este nuevo nombre de vacante ya esta registrado"
                ));
            }

            const responseDelete = await deleteVacante(puesto_vacante.toLowerCase());
            if(!responseDelete.success) return createResponse(500, responseDelete);

            const response = await createVacante(new_puesto_vacante, bodyVacantes);
            if(!response.success) return createResponse(500, response);

            response.message = "Datos de la vacante actualizados";
            return createResponse(200, response);
            
        } else {
            const response = await updateVacante(puesto_vacante.toLowerCase(), bodyVacantes);
            
            if(!response.success) return createResponse(500, response);

            response.message = "Datos de la vacante actualizados";
            return createResponse(200, response);
        }
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
        
        const responseDelete = await deleteVacante(puesto_vacante.toLowerCase());
        if(!responseDelete.success) return createResponse(500, responseDelete);
        
        responseDelete.message = `La vacante para el puesto de "${puesto_vacante}" ha sido eliminada`;
        return createResponse(200, responseDelete);
    }

    return {
        getAllVacancies,
        getVancantesDisponibles,
        createVacancy,
        updateAvailableVacancy,
        updateVacancy,
        deleteVacancy,
    }
})();

module.exports = Vacantes;
