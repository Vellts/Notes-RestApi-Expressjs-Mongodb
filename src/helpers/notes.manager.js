/**
 * Archivo de funciones de notas
 * @module NotesManager
 */

import { randomInt } from 'crypto'

/**
 * Genera un id aleatorio para una nota
 * @returns {String} id
 * @example generate_note_id()
 */
const generate_note_id = () => {
    return randomInt(10000000)
}

export { generate_note_id }