/**
 * Archivo de funciones de autenticación
 * @module AuthManager
 */

import { randomInt } from 'crypto'

/**
 * Genera un id aleatorio para un usuario
 * @returns {String} id
 * @example generate_user_id()
 */
const generate_user_id = () => {
    const random = Math.floor(Date.now() + randomInt(10000000))
    return `${random}`
}

export { generate_user_id }