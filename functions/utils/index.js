
const utils = (() => {
    const _arrayMonths = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];

    const completeDataForDate = (value, length = 2) => {
        if (length === 2) {
            if (value.toString().length === 1) {
                return `0${value}`;
            }
            return value;
        }
        if (length === 3) {
            if (value.toString().length === 1) {
                return `00${value}`
            }
            if (value.toString().length === 2) {
                return `0${value}`
            }
            return value;
        }
        return value;
    }

    const getFechaActual = () => {
        const objecDate = new Date();
        let fecha = "";

        fecha = `${objecDate.getDate()} de ${_arrayMonths[objecDate.getMonth()]} del ${objecDate.getFullYear()}`;
        return fecha;
    }

    const getHoraActual = () => {
        const objecDate = new Date();
        let hora = "";

        hora = `${objecDate.getHours()}:${objecDate.getMinutes()}:${objecDate.getSeconds()}`;
        return hora;
    }

    const createContentAssert = (message, data = null) => {
        if (data === null) {
            return {
                success: true,
                message
            }
        }
        return {
            success: true,
            message,
            data
        }
    }

    const createContentError = (message, error = null) => {
        if (error === null) {
            return {
                success: false,
                message
            }
        }
        return {
            success: false,
            message,
            error
        }
    }

    const createResponse = (status, response) => {
        return {
            status,
            response,
        }
    }

    return {
        createContentAssert,
        createContentError,
        createResponse,
        getFechaActual,
        getHoraActual,
        completeDataForDate,
    }
})();

module.exports = utils;
