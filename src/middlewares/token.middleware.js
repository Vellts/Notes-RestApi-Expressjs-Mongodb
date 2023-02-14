/**
 * Middlewares de tokens
 * @module TokenMiddleware
 */
import jwt from 'jsonwebtoken'

/**
 * Verifica si existe un token de refresco en la cookie y si es valido
 * @param {Object} req | Request object
 * @param {Object} res | Response object
 * @param {Function} next | Next function
 * @returns {void} | Response object
 */
const token_refresh_verify = async (req, res, next) => {
    try {
        const get_token = req.cookies?.refresh_token
        if (!get_token) throw new Error("No existe un token.")

        const { uid } = jwt.verify(get_token, process.env.JWT_REFRESH)

        req.user_id = uid
        next()
    } catch (error) {
        return res.status(401).json({
            errors: [{ msg: error.message }]
        })
    }
}

/**
 * Verifica si existe un token de acceso en los headers y si es valido
 * @param {Object} req | Request object
 * @param {Object} res | Response object
 * @param {Function} next | Next function
 * @returns {void} | Response object
 */
const token_verify = async (req, res, next) => {
    try {
        const get_token = req.headers.authorization

        if (!get_token) throw new Error("No existe un token.")

        const token = get_token.split(' ')[1]
        
        const { uid } = jwt.verify(token, process.env.JWT_SECRET)

        req.user_id = uid
        next()
    } catch (error) {
        res.status(401).json({
            errors: [{ msg: error.message }]
        })
    }
}

export { token_refresh_verify, token_verify }