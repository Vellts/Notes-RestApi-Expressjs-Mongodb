/**
 * Middlewares de autenticación
 * @module AuthMiddleware
 */

import joi from 'joi';
import { cerror } from '../helpers/custom.console.js';

/**
 * Verifica si los campos enviados son validos.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {Function} next Next function.
 * @return {void}
 */
const validate_register = (req, res, next) => {
    const schema = joi.object({
        username: joi.string().required().min(3).max(20).alphanum().trim(),
        email: joi.string().required().email().trim(),
        password: joi.string().required().min(6).max(20).trim(),
        repassword: joi.string().required().min(6).max(20).trim(),
    })

    try {
        const { error } = schema.validate(req.body)
        if (error) throw error
        
        if (req.body.password !== req.body.repassword) throw new Error('Las contraseñas no coinciden.')

        next()
    } catch (error) {
        cerror(error)

        const isError = (Array.isArray(error.details) && error.details.length > 0) ? error.details[0].message : error.message

        res.status(400).json({
            errors: [
                {
                    msg: isError,
                }
            ],
        })
    }
}

/**
 * Verifica si los campos enviados son validos.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {Function} next Next function.
 * @return {void}
 */
const validate_login = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().required().email().trim(),
        password: joi.string().required().min(6).max(20).trim(),
    })

    try {
        const { error } = schema.validate(req.body)
        if (error) throw error

        next()
    } catch (error) {
        cerror(error)

        const isError = (Array.isArray(error.details) && error.details.length > 0) ? error.details[0].message : error.message

        res.status(400).json({
            errors: [
                {
                    msg: isError,
                }
            ],
        })
    }
}

export { validate_register, validate_login }