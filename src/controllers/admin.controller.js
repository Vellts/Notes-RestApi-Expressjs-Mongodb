/**
 * Controlador de administracion de usuarios.
 * @module AdminController
 */

import { User } from "../models/User.model.js"

/**
 * Obtiene todos los usuarios.
 * @route {GET} /api/admin/users/
 * @authentication Requiere autenticacion [Bearer Token]
 * @returns {Array} Array con todos los usuarios.
 * 
*/
const get_users = async (req, res) => {
    try {
        const get_users = await User.find().lean()
        if (!get_users) throw "Error al obtener los usuarios."

        if (get_users.length === 0) return res.status(404).json({ errors: [{ msg: "No hay usuarios para mostrar." }] })

        return res.json({
            errors: null,
            data: get_users
        })
    } catch (error) {
        return res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        })
    }
}


/**
 * Obtiene un usuario.
 * @route {GET} /api/admin/users/:id
 * @authentication Requiere autenticacion [Bearer Token]
 * @routeparam {String} :id ID del usuario
 * @returns {Object} Objeto con el usuario encontrado
 * 
*/
const get_user = async (req, res) => {
    try {
        const { id } = req.params
        
        const user = await User.findOne({ user_id: id }).lean()
        
        if (!user) throw "Error al obtener el usuario."
        
        return res.json({
            errors: null,
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            errors: [ {
                msg: error
            } ]
        })
    }
}

/**
 * Actualiza un usuario.
 * @route {PATCH} /api/admin/users/:id
 * @authentication Requiere autenticacion [Bearer Token]
 * @routeparam {String} :id ID del usuario
 * @bodyparam {String} username Nombre de usuario
 * @bodyparam {String} email Email del usuario
 * @bodyparam {Array} roles Roles del usuario
 * @returns {Object} Objeto con el usuario eliminado
 * 
*/
const update_user = async (req, res) => {
    try {
        const { id } = req.params
        const { username, email, roles } = req.body
        
        const user = await User.findOne({ user_id: id })
        // console.log(user)
        
        if (!user) throw "No se ha encontrado el usuario."

        if(username) user.username = username
        if(email) user.email = email
        if(roles) user.roles = roles
        
        await user.save()
        
        return res.json({
            errors: null,
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errors: [ { msg: error } ]
        })
    }
}   

/**
 * Elimina un usuario.
 * @route {DELETE} /api/admin/users/:id
 * @authentication Requiere autenticacion [Bearer Token]
 * @routeparam {String} :id ID del usuario
 * @returns {Object} Objeto con el usuario eliminado
 * 
*/
const delete_user = async (req, res) => {
    try {
        const { id } = req.params
        
        const user = await User.findOne({ user_id: id })
        
        if(!user) throw "No se ha encontrado el usuario."
        
        await user.delete()
        
        return res.json({
            errors: null,
            msg: "Usuario eliminado correctamente.",
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errors: [ { msg: error } ]
        })
    }
}

export { get_users, get_user, update_user, delete_user }