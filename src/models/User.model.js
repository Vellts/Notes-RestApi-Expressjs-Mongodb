/**
 * Archivo de modelo de usuario
 * @module UserModel
 */

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { cerror } from '../helpers/custom.console.js';

const user_schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    user_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    roles: {
        type: Array,
        default: ['user']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

/**
 * Antes de guardar el usuario, se encripta la contraseña.
 * @function pre
 * @param {String} save Nombre del evento
 * @param {Function} next Funcion que se ejecuta despues de la encriptacion
 * @returns {String} Contraseña encriptada
 * @throws {Error} Si no se pudo encriptar la contraseña
 */
user_schema.pre('save', async function(next) {
    const user = this
    if(!user.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash
        next()
    } catch (error) {
        cerror(error)
        throw new Error('Fallo el hash de la contraseña.')
    }
})

/**
 * Compara la contraseña del usuario con la contraseña encriptada.
 * @function comparePassword
 * @param {String} payload Contraseña del usuario
 * @returns {Boolean} True si la contraseña es correcta, false si no lo es.
 * @throws {Error} Si no se pudo comparar la contraseña
 */
user_schema.methods.comparePassword = async function (payload) {
    return await bcrypt.compare(payload, this.password)
}

export const User = model('User', user_schema)