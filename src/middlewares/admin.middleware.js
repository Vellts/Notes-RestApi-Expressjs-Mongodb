/**
 * Middlewares para el manejo de usuarios.
 * @module AdminMiddleware
 */

import { User } from '../models/User.model.js';
import joi from 'joi';

/**
 * Verifica si el usuario es admin.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {Function} next Next function.
 * @returns {Object} res Response object.
 */
const is_admin = async (req, res, next) => {
    try {
        const { user_id } = req
        const find_roles = await User.findOne({ user_id }, { roles: 1 })

        if(!find_roles) return res.status(400).json({ errors: [{ msg: "No se encontro el usuario." }] })

        const { roles } = find_roles

        if(!roles.includes("admin")) return res.status(400).json({ errors: [{ msg: "No tienes permisos para realizar esta accion." }] })
        
        next()
    } catch (error) {
        // cerror(error)
        res.status(500).json({ errors: [{ msg: "Error interno del servidor." }] })
    }
}

/**
 * Verifica si los campos enviados son validos.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {Function} next Next function.
 * @return {void}
 */
const validate_update_user = (req, res, next) => {
    try {
        const schema = joi.object({
            username: joi.string().min(3).max(20).optional(),
            email: joi.string().email().optional(),
            roles: joi.array().items(joi.string().valid("user", "admin", "mod")).optional(),
        })

        const { username, email, roles } = req.body

        const { error } = schema.validate({ username, email, roles })

        if(error) throw error.details[0].message
        if(!username && !email && !roles) throw "No se enviaron datos para actualizar."

        next()
    } catch (error) {
        return res.status(500).json({ errors: [{ msg: error }] })
    }
}

export { is_admin, validate_update_user }