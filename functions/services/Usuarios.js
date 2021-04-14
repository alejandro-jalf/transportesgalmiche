const {
    sendEmail,
    createResponse,
    configureNameEmail,
    encriptData,
    createContentError,
} = require("../utils");
const {
    validateBodyCrateUser,
    validateBodyLogin,
    validateBodyUpdateUser,
    validateBodyEmail,
    validateBodyUpdatePassword,
    validateBodyUpdateStatus,
    validateBodyUpdateEmail,
} = require("../validations");
const {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
    verifyExistUserById,
    getDataFirebase,
} = require("../models");

const Usuarios = (() => {

    const getAllUsuarios = async () => {
        const result = await getAllUsers();

        if (result.message === 'Error al consultar la base de datos') {
            return createResponse(500, result);
        }

        return createResponse(200, result);
    }

    const getUsuarioById = async (correo_user) => {
        const result = await getUserById(configureNameEmail(correo_user));

        if (result.message === 'Error al consultar la base de datos') {
            return createResponse(500, result);
        }

        return createResponse(200, result);
    }

    const createUsuario = async (bodyUsuarios) => {
        const resultValidate = validateBodyCrateUser(bodyUsuarios);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        const correo_user = configureNameEmail(bodyUsuarios.correo_user);
        const existUser = await getUserById(correo_user);
        if (existUser.message === "Error al consultar la base de datos") {
            return createResponse(500, existUser);
        }

        if (existUser.success) {
            return createResponse(200, createContentError(`El correo ${bodyUsuarios.correo_user} ya esta registrado`, {}));
        }

        bodyUsuarios.password_user = encriptData(bodyUsuarios.password_user);
        bodyUsuarios.recovery_code_user = 'empty';
        bodyUsuarios.activo_user = true;
        const response = await createUser(correo_user, bodyUsuarios);

        if(!response.success) return createResponse(500, response);

        return createResponse(201, response);
    }

    const loginUsuario = async (bodyLogin) => {
        const resultValidate = validateBodyLogin(bodyLogin);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        const correo_user = configureNameEmail(bodyLogin.correo_user);
        const existUser = await getUserById(correo_user);
        if (existUser.message === "Error al consultar la base de datos") {
            return createResponse(500, existUser);
        }
        
        if (!existUser.success) {
            return createResponse(200, existUser);
        }

        if (existUser.data.password_user !== encriptData(bodyLogin.password_user)) {
            return createResponse(
                401,
                createContentError("La contraseña es incorrecta", {})
            );
        }

        if (!existUser.data.activo_user) {
            return createResponse(
                401,
                createContentError("Tu cuenta esta supendida, comunicate con el administrador", {})
            );
        }

        const config = await getDataFirebase();

        delete existUser.data.recovery_code_user;
        delete existUser.data.password_user;

        existUser.message = "Bienvenido";
        existUser.data.firebaseConfig = (config.data. firebaseConfig) ?  config.data. firebaseConfig : {};
        return createResponse(200, existUser);
    }

    const updateUsuario = async (correo_user, bodyUsuarios) => {
        const resultValidate = validateBodyUpdateUser(bodyUsuarios);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        if (correo_user !== bodyUsuarios.correo_user) {
            const existUser = await verifyExistUserById(correo_user, bodyUsuarios.correo_user);
            if (existUser.message === "Error al consultar la base de datos") {
                return createResponse(500, existUser);
            }
            
            if (!existUser.success) {
                return createResponse(200, existUser);
            }

            correo_user = configureNameEmail(correo_user);
            const newEmail = bodyUsuarios.correo_user;
            bodyUsuarios.correo_user = newEmail;

            bodyUsuarios['password_user'] = existUser.data.password_user;
            bodyUsuarios['recovery_code_user'] = existUser.data.recovery_code_user;

            const responseDelete = await deleteUser(correo_user);
            if(!responseDelete.success) return createResponse(500, responseDelete);

            correo_user = configureNameEmail(bodyUsuarios.correo_user);
            const responseCreate = await createUser(correo_user, bodyUsuarios);
            if(!responseCreate.success) return createResponse(500, responseCreate);

            responseCreate.message = "Datos actualizados con exito";
            return createResponse(200, responseCreate);
        } else {
            correo_user = configureNameEmail(correo_user);
            const existUser = await getUserById(correo_user);
            if (existUser.message === "Error al consultar la base de datos") {
                return createResponse(500, existUser);
            }

            if (!existUser.success) {
                return createResponse(200, existUser);
            }

            bodyUsuarios['correo_user'] = existUser.data.correo_user;
            bodyUsuarios['password_user'] = existUser.data.password_user;
            bodyUsuarios['recovery_code_user'] = existUser.data.recovery_code_user;
            const response = await updateUser(correo_user, bodyUsuarios);
            
            if(!response.success) return createResponse(500, response);
            
            return createResponse(200, response);
        }
    }

    const updateCorreo = async (correo_user, bodyCorreo) => {
        const resultValidate = validateBodyUpdateEmail(bodyCorreo);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        if (correo_user === bodyCorreo.correo_user) {
            return createResponse(
                200,
                createContentError("El nuevo correo es igual al correo actual", {})
            );
        }

        const existUser = await verifyExistUserById(correo_user, bodyCorreo.correo_user);
        if (existUser.message === "Error al consultar la base de datos") {
            return createResponse(500, existUser);
        }
        
        if (!existUser.success) {
            return createResponse(200, existUser);
        }

        if (existUser.data.password_user !== encriptData(bodyCorreo.password_user)) {
            return createResponse(
                401,
                createContentError("La contraseña actual no es correcta", {})
            );
        }
        
        correo_user = configureNameEmail(correo_user);
        const newEmail = bodyCorreo.correo_user;
        bodyCorreo = existUser.data;
        bodyCorreo.correo_user = newEmail;
        
        const responseDelete = await deleteUser(correo_user);
        if(!responseDelete.success) return createResponse(500, responseDelete);
        
        correo_user = configureNameEmail(bodyCorreo.correo_user);
        const responseCreate = await createUser(correo_user, bodyCorreo);
        if(!responseCreate.success) return createResponse(500, responseCreate);

        responseCreate.message = "El Correo ha sido actualizado";
        return createResponse(200, responseCreate);
    }

    const updateContra = async (correo_user, bodyPassword) => {
        const resultValidate = validateBodyUpdatePassword(bodyPassword);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        correo_user = configureNameEmail(correo_user);
        const existUser = await getUserById(correo_user);
        if (existUser.message === "Error al consultar la base de datos") {
            return createResponse(500, existUser);
        }
        
        if (!existUser.success) {
            return createResponse(200, existUser);
        }

        if (existUser.data.recovery_code_user === 'empty') {
            if (existUser.data.password_user !== encriptData(bodyPassword.password_user)) {
                return createResponse(
                    200,
                    createContentError("Contraseña actual incorrecta", {})
                );
            }
        } else {
            if (
                existUser.data.password_user !== encriptData(bodyPassword.password_user) &&
                existUser.data.recovery_code_user !== bodyPassword.password_user
            ) {
                return createResponse(
                    200,
                    createContentError("Codigo de seguridad y contraseña actual incorrecta", {})
                );
            }
        }

        if (existUser.data.password_user === encriptData(bodyPassword.new_password_user)) {
            return createResponse(
                200,
                createContentError("La nueva contraseña y la contraeña actual son iguales", {})
            );
        }

        const newPassword = encriptData(bodyPassword.new_password_user);
        bodyPassword = existUser.data;
        bodyPassword.password_user = newPassword;
        bodyPassword.recovery_code_user = 'empty'
        const response = await updateUser(correo_user, bodyPassword);
        
        if(!response.success) return createResponse(500, response);
        
        response.message = "La contraseña ha sido actualizada";
        return createResponse(200, response);
    }

    const recuperaPassword = async (correo_user) => {
        const existUser = await getUserById(configureNameEmail(correo_user));
        if (existUser.message === "Error al consultar la base de datos") {
            return createResponse(500, existUser);
        }
        
        if (!existUser.success) {
            return createResponse(200, existUser);
        }

        const caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ012346789";
        let codigo = "";
        for (i=0; i<8; i++) codigo +=caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
        console.log(codigo)

        const dataUser = existUser.data;
        dataUser.recovery_code_user = codigo;

        let response = await updateUser(configureNameEmail(correo_user), dataUser);
        
        if(!response.success) return createResponse(500, response);

        const content = `
        <h1>Se esta recuperando tu cuenta</h1>
        <p>Para poder recuperar tu cuenta es necesario que vayas a la pagina oficial de transportes galmiche e ingreses al apartado de iniciar sesion, tendras que colocar tu correo electronico como lo haces normalmente cuando inicias sesion y en el apartado de contraseña deberas escribir el codigo de seguridad que se te esta proporcionado a continuacion:</p> <br>
        <b>Codigo de seguridad: </b> ${codigo} <br>
        <p>Posteriormente cuando ya hayas iniciado sesion es importante que cambies tu contraseña por una que sea facil de recordar para ti y que sea dificil de decifrar para los demas, es importante recordar que tu nueva contraseña debe ser mayor de 6 caracteres y debe contener por lo menos una letra y un numero</p>
        `;

        response = await sendEmail(correo_user, 'Codigo de seguridad', content);

        return createResponse(200, response);
    }

    const updateActivo = async (correo_user, bodyActivo) => {
        const resultValidate = validateBodyUpdateStatus(bodyActivo);
        if (!resultValidate.success) {
            return createResponse(400, resultValidate);
        }

        correo_user = configureNameEmail(correo_user);
        const existUser = await getUserById(correo_user);
        if (existUser.message === "Error al consultar la base de datos") {
            return createResponse(500, existUser);
        }
        
        if (!existUser.success) {
            return createResponse(200, existUser);
        }

        if (existUser.data.activo_user === bodyActivo.activo_user) {
            return createResponse(
                200,
                createContentError("El estatus de activo_user es igual", {})
            );
        }

        const newActivoUser = bodyActivo.activo_user;
        bodyActivo = existUser.data;
        bodyActivo.activo_user = newActivoUser;
        const response = await updateUser(correo_user, bodyActivo);
        
        if(!response.success) return createResponse(500, response);

        const tipo_activo = newActivoUser ? 'Activo' : 'Inactivo';
        
        response.message = "Se a cambiado el estatus del usuario a: " + tipo_activo;
        return createResponse(200, response);
    }

    const deleteUsuario = async (correo_user) => {
        correo_user = configureNameEmail(correo_user);
        const existUser = await getUserById(correo_user);
        if (existUser.message === "Error al consultar la base de datos") {
            return createResponse(500, existUser);
        }
        
        if (!existUser.success) {
            return createResponse(200, existUser);
        }
        
        const responseDelete = await deleteUser(correo_user);
        if(!responseDelete.success) return createResponse(500, responseDelete);
        
        responseDelete.message = `La cuenta de usuario ${correo_user} ha sido eliminada`;
        return createResponse(200, responseDelete);
    }

    return {
        getAllUsuarios,
        getUsuarioById,
        createUsuario,
        loginUsuario,
        updateUsuario,
        updateCorreo,
        updateContra,
        recuperaPassword,
        updateActivo,
        deleteUsuario,
    }

})();

module.exports = Usuarios;
