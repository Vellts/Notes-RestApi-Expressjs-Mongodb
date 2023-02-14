/**
 * Archivo de middlewares de notas
 * @module NotesMiddleware
 */

import joi from 'joi'
import { cerror } from '../helpers/custom.console.js'

/**
 * Verifica si los campos enviados son validos.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {Function} next Next function.
 * @return {void}
 */
const validate_note = (req, res, next) => {
    const schema = joi.object({
        title: joi.string().required(),
        content: joi.string().required(),
    })
    
    try {
        const { title, content } = req.body
        const { error } = schema.validate({ title, content })

        if (error) throw error.details[0].message

        next()
    } catch (error) {
        res.status(400).json({
            errors: [
                error
            ]
        })
        cerror(error)
    }
}

/**
 * Verifica si los campos enviados son validos.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {Function} next Next function.
 * @return {void}
 */
const validate_note_update = async (req, res, next) => {
    const schema = joi.object({
        title: joi.string().optional(),
        content: joi.string().optional()
    })
    
    try {
        const { title, content } = req.body
        const { error } = schema.validate({ title, content })
        // console.log(error)
        if(!title && (!content)) throw "No se especifico ningun campo para actualizar."

        if (error) throw error.details[0].message

        next()
    } catch (error) {
        // console.log(error, true)
        res.status(400).json({
            errors: [
                error
            ]
        })
        // cerror(error)
    }
}

export { validate_note, validate_note_update }