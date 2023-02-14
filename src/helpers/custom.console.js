const date = new Date();
const template = `>>> [${date.toLocaleDateString()} - ${date.getHours()}/${date.getMinutes()}/${date.getSeconds()}] `;

/**
 * @param {String} message - message to log
 * @returns {String} - log message
 * @description - log error message
 * @example - error('Error message')
 */
const csuccess = (message) => {
    // console.info(message)
    return console.info(`✅ ${template} ${message}`);
}

/**
 * @param {String|Error} message - message to log
 * @returns {String} - log message
 * @description - log error message
 * @example - error('Error message')
 */
const cerror = (message) => {
    console.log(message)
    // message.fileName ? console.error(`❎ ${template} Error en el archivo ${message.fileName} en la línea ${message.lineNumber}`) : null
    return console.error(`❎ ${template} ${message}`);
}

export { csuccess, cerror }