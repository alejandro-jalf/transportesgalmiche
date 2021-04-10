const router = require('express').Router();
const {
    getAllUsuarios,
    getUsuarioById,
} = require('../services');

router.route("/v1/usuarios").get(async (req, res) => {
    const { status, response } = await getAllUsuarios();
    res.status(status).json(response);
});

router.route("/v1/usuarios/:id_user").get(async (req, res) => {
    const { id_user } = req.params;
    const { status, response } = await getUsuarioById(id_user);
    res.status(status).json(response);
});

router.route("/v1/usuarios").post(async (req, res) => {
    const bodyUsuarios = req.body;
    const { status, response } = await createUsuario(bodyUsuarios);
    res.status(status).json(response);
});

router.route("/v1/usuarios/login").post(async (req, res) => {
    const bodyLogin = req.body;
    const { status, response } = await loginUsuario(bodyLogin);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:id_user").put(async (req, res) => {
    const { id_user } = req.params;
    const bodyUsuarios = req.body;
    const { status, response } = await updateUsuario(id_user, bodyUsuarios);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:id_user/correo").put(async (req, res) => {
    const { id_user } = req.params;
    const bodyCorreo = req.body;
    const { status, response } = await updateCorreo(id_user, bodyCorreo);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:id_user/password").put(async (req, res) => {
    const { id_user } = req.params;
    const bodyPassword = req.body;
    const { status, response } = await updateContra(id_user, bodyPassword);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:id_user/recovery").put(async (req, res) => {
    const { id_user } = req.params;
    const bodyPassword = req.body;
    const { status, response } = await recuperaPassword(id_user, bodyPassword);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:id_user/activo").put(async (req, res) => {
    const { id_user } = req.params;
    const bodyActivo = req.body;
    const { status, response } = await updateActivo(id_user, bodyActivo);
    res.status(status).json(response);
});

router.route("/v1/usuarios/:id_user").delete(async (req, res) => {
    const { id_user } = req.params;
    const { status, response } = await deleteUsuario(id_user);
    res.status(status).json(response);
});

module.exports = router;
