const { createContentAssert, createContentError  } = require("../utils");

const general = (() => {

    const getDataFirebase = async () => {
        try {
            const document = admin.firestore().collection("transportes").doc("configs");
            const response = await document.get();
            const data = response.data();

            if (Object.values(data).length === 0) {
                return createContentError("No hay data de firebase", data);
            }

            return createContentAssert("Data de configuracion", data);
        } catch (error) {
            console.log(error);
            return createContentError("Error al consultar la base de datos", error);
        }
    }

    return {
        getDataFirebase,
    }
})();

module.exports = general;
