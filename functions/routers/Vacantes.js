const router = require("express").Router();
const {
    getAllVacancies,
    getVancantesDisponibles,
    createVacancy,
    updateVacancy,
    updateAvailableVacancy,
    deleteVacancy,
} = require('../services');

router.route("/v1/vacantes").get(async (req, res) => {
    const { status, response } = await getAllVacancies();
    res.status(status).json(response);
});

router.route("/v1/vacantes/disponibles").get(async (req, res) => {
    const { status, response } = await getVancantesDisponibles();
    res.status(status).json(response);
});

router.route("/v1/vacantes").post(async (req, res) => {
    const { body } = req;
    const { status, response } = await createVacancy(body);
    res.status(status).json(response);
});

router.route("/v1/vacantes/:puesto_vacante").put(async (req, res) => {
    const { body, params } = req;
    const { puesto_vacante } = params;
    const { status, response } = await updateVacancy(puesto_vacante, body);
    res.status(status).json(response);
});

router.route("/v1/vacantes/:puesto_vacante/disponible").put(async (req, res) => {
    const { body, params } = req;
    const { puesto_vacante } = params;
    const { status, response } = await updateAvailableVacancy(puesto_vacante, body);
    res.status(status).json(response);
});

router.route("/v1/vacantes/:puesto_vacante").delete(async (req, res) => {
    const { puesto_vacante } = req.params;
    const { status, response } = await deleteVacancy(puesto_vacante);
    res.status(status).json(response);
});

module.exports = router;
