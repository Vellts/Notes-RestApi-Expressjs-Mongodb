/**
 * Controlador de notas.
 * @module NotesController
 */

import { cerror, csuccess } from "../helpers/custom.console.js";
import { generate_note_id } from "../helpers/notes.manager.js";
import { Note } from "../models/Notes.model.js";

/**
 * Crea una nueva nota
 * @route {POST} /api/notes/new
 * @authentication Private
 * @bodyparam {String} title Titulo de la nota
 * @bodyparam {String} content Contenido de la nota
 * @returns {Object} Objeto con la nota creada
 */
const create_note = async (req, res) => {
    try {

        const check_user_notes = await Note.find({ user_id: req.user_id }).countDocuments()

        if (check_user_notes >= 10) throw "No puedes crear mas de 10 notas."

        const { title, content } = req.body;
        const id = generate_note_id()
        // console.log(req.user_id)
        const note = {
            id,
            title,
            content,
            user_id: req.user_id
        }

        const notes = await Note.create(note)
        if(!notes) throw new Error("Error al crear la nota.")

        await notes.save()

        csuccess(`Nota creada con exito. Datos: [ ID: ${id}, Titulo: ${title}, Contenido: ${content}, Usuario: ${req.user_id} ]`)

        return res.json({
            errors: null,
            data: [
                {
                    msg: "Nota creada con exito.",
                },
                note
            ]
        })

    } catch (error) {
        cerror(error)

        res.json({
            errors: [
                error
            ]
        })
    }
}

/**
 * Obtiene todas las notas del usuario
 * @route {GET} /api/notes/all
 * @authentication Requiere autenticacion [Bearer Token]
 * @returns {Array} Array con las notas del usuario
 */
const get_all_notes = async (req, res) => {
    try {
        const { user_id } = req

        const get_notes = await Note.find({ user_id }).lean()
        if (!get_notes) throw "Error al obtener las notas."
        if (get_notes.length === 0) return res.status(404).json({
            errors: [
                {
                    msg: "No hay notas para mostrar."
                }
            ]
        })
        
        console.log(get_notes)
        return res.json({
            errors: null,
            data: get_notes
        })
    } catch (error) {
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        })
    }
}

/**
 * Obtiene una nota del usuario.
 * @route {GET} /api/notes/get/:id
 * @authentication Requiere autenticacion [Bearer Token]
 * @routeparam {String} :id ID de la nota
 * @returns {Object} Objeto con la nota encontrada
 * 
*/
const get_note = async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req

        if (!id) throw "ID no especificado."
        
        const get_note = await Note.findOne({ id, user_id }).lean()
        
        if (!get_note) return res.status(404).json({ errors: [{ msg: "No se encontro la nota." }] })

        return res.json({
            errors: null,
            data: get_note
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
 * Actualiza una nota del usuario.
 * @route {PATCH} /api/notes/update/:id
 * @authentication Requiere autenticacion [Bearer Token]
 * @routeparam {String} :id ID de la nota
 * @bodyparam {String} title Titulo de la nota
 * @bodyparam {String} content Contenido de la nota
 * @returns {Object} Objeto con la nota actualizada
 */
const update_note = async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req
        const { title, content } = req.body

        if (!id) throw "ID no especificado."

        const find_note = await Note.findOne({ id, user_id })
        if (!find_note) return res.status(404).json({ errors: [{ msg: "No se encontro la nota." }] })

        if(title) find_note.title = title
        if(content) find_note.content = content

        await find_note.save()

        return res.json({
            errors: null,
            data: [
                {
                    msg: "Nota actualizada con exito."
                },
                find_note
            ]
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errors: [ { msg: error } ]
        })
    }
}

/**
 * Elimina una nota del usuario.
 * @route {DELETE} /api/notes/delete/:id
 * @authentication Requiere autenticacion [Bearer Token]
 * @routeparam {String} :id ID de la nota
 * @returns {Object} Objeto con la nota eliminada
 */
const delete_note = async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req

        const delete_ = await Note.findOneAndDelete({ id, user_id })
        if (!delete_) return res.status(404).json({ errors: [{ msg: "No se encontro la nota." }] })

        return res.json({
            errors: null,
            data: [
                {
                    msg: "Nota eliminada con exito."
                },
                delete_
            ]
        })
    } catch (error) {
        return res.status(500).json({
            errors: [ { msg: error } ]
        })
    }
}

export { create_note, get_all_notes, get_note, update_note, delete_note }