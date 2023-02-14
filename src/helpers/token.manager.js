/**
 * Archivo de funciones de tokens
 * @module TokenManager
 */

import jwt from 'jsonwebtoken'
import { cerror } from './custom.console.js'

/**
 * Genera un token de refresco
 * @param {String} uid User id
 * @param {Object} res Response
 * @returns {Object} Objeto con el token de refresco
 * @example generate_refresh_token(uid, res)
 */
const generate_refresh_token = (uid, res) => {
    try {
        const expires_at = 60 * 60 * 24 * process.env.DAYS_EXPIRES_REFRESH_IN
        const refresh_token = jwt.sign({ uid }, process.env.JWT_REFRESH, { expiresIn: expires_at })
        
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: !(process.env.MODE === 'dev'),
            expires: new Date(Date.now() + expires_at * 1000)
        })
    } catch (error) {
        cerror(error.message)
        res.status(500).json({
            errors: [{ msg: error.message }]
        })
    }
}

/**
 * Genera un token de acceso
 * @param {String} uid User id
 * @returns {Object} Objeto con el token de acceso
 * @example generate_token(uid)
 */
const generate_token = (uid) => {
    try {
        const expires_at = 60 * process.env.MINUTES_EXPIRES_IN
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: expires_at })
        return {
            token,
            expires_at
        }
    } catch (error) {
        cerror(error.message)
    }
}

export { generate_refresh_token, generate_token }