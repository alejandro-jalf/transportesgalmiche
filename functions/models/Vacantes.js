const { createContentAssert, createContentError, } = require("../utils");
const admin = require("firebase-admin");

const vacantes = (() => {

    const getAllVacantes = async () => {
        try {
            const document = admin.firestore().collection("transportes").doc("Vacantes");
            const response = await document.get();
            const data = response.data();

            if (Object.values(data).length === 0) {
                return createContentError("No hay Vacantes registradas", data);
            }

            return createContentAssert("Lista de Vacantes", data);
        } catch (error) {
            console.log(error);
            return createContentError("Error al consultar la base de datos", error);
        }
    }

    const getVacanteByName = async (puesto_vacante = "") => {
        try {
            const document = admin.firestore().collection("transportes").doc("Vacantes");
            const response = await document.get();
            const data = response.data();

            if (Object.values(data).length === 0) {
                return createContentError("No hay puestos registrados");
            }

            const vacanteFinded = Object.values(data).find(
                (vacante) => vacante.puesto_vacante.toLowerCase().trim() === puesto_vacante.toLowerCase().trim()
            );
            if (!vacanteFinded) {
                return createContentError(`La vacante ${puesto_vacante} no esta registrado`)
            }

            return createContentAssert("vacante localizada", vacanteFinded);
        } catch (error) {
            console.log(error);
            return createContentError("Error al consultar la base de datos", error);
        }
    }

    const createVacante = async (puesto_vacante, bodyVacantes) => {
        try {
            const vacante = {};
            vacante[`${puesto_vacante}`] = bodyVacantes;
            const doc = admin.firestore().collection("transportes").doc("Vacantes");
            const writeResult = await doc.set(vacante, { merge: true });

            return createContentAssert(`Se ha creado la vacante para el puesto de: ${bodyVacantes.puesto_vacante}`, writeResult);
        } catch (error) {
            console.log(error);
            return createContentError("Error al crear el usuario", error);
        }
    }

    const updateVacante = async (puesto_vacante, bodyVacantes) => {
        try {
            const document = admin.firestore().collection("transportes").doc("Vacantes");

            const vacanteUpdate = {};
            vacanteUpdate[`${puesto_vacante}`] = bodyVacantes;

            const resultUpdate = await document.update(vacanteUpdate);

            return createContentAssert("Datos de la vacante actualizados", resultUpdate);
        } catch (error) {
            console.log(error);
            return createContentError("Error al actualizar el usuario", error);
        }
    }
    
    const deleteVacante = async (puesto_vacante) => {
        try {
            console.log(puesto_vacante);
            puesto_vacante = puesto_vacante.trim();
            const FieldValue = admin.firestore.FieldValue;
            const document = admin.firestore().collection("transportes").doc("Vacantes");
        
            const del = {};
            del[`${puesto_vacante}`] = FieldValue.delete();
            const resultDelete = await document.update(del);
        
            return createContentAssert("Vacante eliminada", resultDelete);
        } catch (error) {
            console.log(error);
            return createContentError("Error al eliminar el usuario", error);
        }
    }

    return {
        getAllVacantes,
        getVacanteByName,
        createVacante,
        updateVacante,
        deleteVacante,
    }
})();

module.exports = vacantes;
