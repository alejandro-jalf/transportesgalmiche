const {
    createContentAssert,
    createContentError,
    configureNameEmail,
} = require("../utils");

const usuarios = (() => {

    const getAllUsers = async () => {
        try {
            const document = admin.firestore().collection("transportes").doc("Usuarios");
            const response = await document.get();
            const data = response.data();

            if (Object.values(data).length === 0) {
                return createContentError("No hay usuarios registrados", data);
            }

            return createContentAssert("Lista de usuarios", data);
        } catch (error) {
            console.log(error);
            return createContentError("Error al consultar la base de datos", error);
        }
    }
    
    const getUserById = async (correo_user) => {
        try {
            const document = admin.firestore().collection("transportes").doc("Usuarios");
            const response = await document.get();
            const data = response.data();

            if (Object.values(data).length === 0) {
                return createContentError("No hay usuarios registrados");
            }

            const userFinded = data[`${correo_user}`];
            if (!userFinded) {
                return createContentError(`El usuario ${correo_user} no esta registrado`)
            }

            return createContentAssert("Usuario localizado", userFinded);
        } catch (error) {
            console.log(error);
            return createContentError("Error al consultar la base de datos", error);
        }
    }
    
    const verifyExistUserById = async (correo_user, newIdUSer) => {
        try {
            const document = admin.firestore().collection("transportes").doc("Usuarios");
            const response = await document.get();
            const data = response.data();

            if (Object.values(data).length === 0) {
                return createContentError("No hay usuarios registrados");
            }

            const userFindedThis = data[`${configureNameEmail(correo_user)}`];
            if (!userFindedThis) {
                return createContentError(`El usuario ${correo_user} no esta registrado`);
            }

            const userFinded = data[`${configureNameEmail(newIdUSer)}`];

            if (userFinded) {
                return createContentError(`El correo ${newIdUSer} ya esta dado de alta`);
            }

            return createContentAssert("Correo nuevo aprovado", userFindedThis);
        } catch (error) {
            console.log(error);
            return createContentError("Error al consultar la base de datos", error);
        }
    }
    
    const createUser = async (correo_user, bodyUsuarios) => {
        try {
            const user = {};
            user[`${correo_user}`] = bodyUsuarios;
            const doc = admin.firestore().collection("transportes").doc("Usuarios");
            const writeResult = await doc.set(user, { merge: true });

            return createContentAssert(`El usuario ${bodyUsuarios.correo_user} ha sido creado`, writeResult);
        } catch (error) {
            console.log(error);
            return createContentError("Error al crear el usuario", error);
        }
    }

    const updateUser = async (correo_user, bodyUsuarios) => {
        try {
            const document = admin.firestore().collection("transportes").doc("Usuarios");

            const userUpdate = {};
            userUpdate[`${correo_user}`] = bodyUsuarios;

            const resultUpdate = await document.update(userUpdate);

            return createContentAssert("Usuario actualizado", resultUpdate);
        } catch (error) {
            console.log(error);
            return createContentError("Error al actualizar el usuario", error);
        }
    }
    
    const deleteUser = async (correo_user) => {
        try {
            const FieldValue = admin.firestore.FieldValue;
            const document = admin.firestore().collection("transportes").doc("Usuarios");
        
            const del = {};
            del[`${correo_user}`] = FieldValue.delete();
            const resultDelete = await document.update(del);
        
            return createContentAssert("Usuario eliminado", resultDelete);
        } catch (error) {
            console.log(error);
            return createContentError("Error al eliminar el usuario", error);
        }
    }

    return {
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        verifyExistUserById,
        deleteUser,
    }
})();

module.exports = usuarios;
