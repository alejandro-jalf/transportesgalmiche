const router = require("express").Router();
const {
    sendMail,
    getDataConfigFirebase,
} = require("../services");

router.route("/v1/firebaseconfig").get(async (req, res) => {
    const { status, response } = await getDataConfigFirebase();
    res.status(status).json(response);
});

router.route("/v1/requestInformation").post(async (req, res) => {
    const { body } = req;
    const { status, response } = await requestInformation(body);
    res.status(status).json(response);
});

module.exports = router;
