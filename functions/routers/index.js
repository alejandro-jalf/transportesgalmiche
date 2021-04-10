const router = require("express").Router();

router.use(require('./General'));
router.use(require('./Usuarios'));
router.use(require('./Vacantes'));

module.exports = router;
