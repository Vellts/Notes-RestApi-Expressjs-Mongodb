/**
 * Controlador de autenticacion de usuarios.
 * @Module AuthController
 */

import { generate_user_id } from "../helpers/auth.manager.js";
import { cerror } from "../helpers/custom.console.js";
import { User } from "../models/User.model.js";
import { generate_refresh_token, generate_token } from "../helpers/token.manager.js";

/**
 * Registra un nuevo usuario.
 * @route {POST} /api/auth/register
 * @authentication No requiere autenticacion [Bearer Token]
 * @bodyparam {String} username Nombre de usuario
 * @bodyparam {String} email Email del usuario
 * @bodyparam {String} password Contraseña del usuario
 * @returns {Object} Objeto con el usuario creado
 * 
*/
const register_user = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ username });

        if(user) return res.status(400).json({
            errors: [{ msg: "El usuario ya existe." }],
        })

        user = await User.findOne({ email });

        if(user) return res.status(400).json({
            errors: [{ msg: "El email ya existe." }],
        })

        const user_id = generate_user_id()
        
        const roles = ["user"]
        if(username === "admin"){
            roles.push("admin")
        } 

        user = new User({
            username,
            email,
            password,
            user_id,
            roles,
        })

        await user.save()
        cerror(`Usuario registrado con exito. Datos: [ Username: ${user.username}, Email: ${user.email}, ID: ${user.user_id} ]`)

        return res.json({
            errors: null,
            data: [
                {
                    msg: "Usuario registrado con exito.",
                    data: {
                        username: user.username,
                        email: user.email,
                        user_id: user.user_id,
                    }
                }
            ]
        })

    } catch (error) {
        cerror(error)
        return res.status(500).json({
            errors: [{ msg: "Error de servidor al registrar el usuario." }],
        })
    }
}


/**
 * Loguea un usuario.
 * @route {POST} /api/auth/login
 * @authentication No requiere autenticacion [Bearer Token]
 * @bodyparam {String} email Email del usuario
 * @bodyparam {String} password Contraseña del usuario
 * @returns {Object} Objeto con el usuario logueado
 */
const login_user = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email })

        if(!user) return res.status(403).json({
            errors: [{ msg: "Credenciales inválidas." }],
        })

        const confirm_password = await user.comparePassword(password)
        if(!confirm_password) return res.status(403).json({
            errors: [{ msg: "Credenciales inválidas." }],
        })
        
        generate_refresh_token(user.user_id, res)
        
        res.json({
            errors: null,
            msg: "Usuario logueado con exito.",
            data: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        cerror(error)
    }
}


/**
 * Obtiene un token de acceso.
 * @route {GET} /api/auth/get_token
 * @authentication Requiere autenticacion [Bearer Token]
 * @returns {Object} Objeto con el token de acceso
 */
const get_token = async (req, res) => {
    try {
        const { token } = generate_token(req.user_id)
        return res.json({
            errors: null,
            data: {
                token,
                msg: "Token generado con exito."
            }
        })
    } catch (error) {
        cerror(error)
    }
}

/**
 * Cierra la sesión del usuario.
 * @route {GET} /api/auth/logout
 * @authentication No requiere autenticacion [Bearer Token]
 * @returns {Object} Objeto con el mensaje de cierre de sesión
 */
const logout = async (req, res) => {
    try {
        res.clearCookie("refresh_token")
        return res.json({
            errors: null,
            data: {
                msg: "Sesión cerrada con exito."
            }
        })
    } catch (error) {
        return res.status(500).json({
            errors: [{ msg: "Error de servidor al cerrar sesión." }],
        })
    }
}

export { register_user, login_user, get_token, logout }