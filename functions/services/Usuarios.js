const { sendEmail , createResponse } = require("../utils");
const validations = require("../validations");
const {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
    verifyExistUserById,
} = require("../models");

const Usuarios = (() => {

    const getAllUsuarios = async () => {
        const result = await getAllUsers();

        if (!result.success && result.message !== 'No hay usuarios registrados') {
            return createResponse(500, result);
        }

        return createResponse(200, result);
    }

    const getUsuarioById = async (correo_user) => {
        const result = await getUserById(correo_user);

        if (!result.success && result.message === 'Error al consultar la base de datos') {
            return createResponse(500, result);
        }

        return createResponse(200, result);
    }

    // const createUsuario = async (bodyUser) => {
    //     return creat
    // }

    return {
        getAllUsuarios,
        getUsuarioById,
    }

})();

module.exports = Usuarios;
