const router = require("express").Router();

router.route("/v1/vacantes").get(async (req, res) => {
    const { status, response } = await getAllVancantes();
    res.status(status).json(response);
});

router.route("/v1/vacantes/disponibles").get(async (req, res) => {
    const { status, response } = await getVancantesDisponibles();
    res.status(status).json(response);
});

router.route("/v1/vacantes").post(async (req, res) => {
    const { body } = req;
    const { status, response } = await sendMail(body);
    res.status(status).json(response);
});

module.exports = router;
