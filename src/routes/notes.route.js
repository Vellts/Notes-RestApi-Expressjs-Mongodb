import { Router } from "express";
import { create_note, delete_note, get_all_notes, get_note, update_note } from "../controllers/notes.controller.js";
import { validate_note, validate_note_update } from "../middlewares/notes.middleware.js";
import { token_verify } from "../middlewares/token.middleware.js";

const router = Router()

// Routes
// * @route | POST /api/notes/new | Create a new note
// * @access | Private

// * @route | GET /api/notes/get | Get all notes
// * @access | Private

// * @route | GET /api/notes/get/:id | Get a note
// * @access | Private

// * @route | PATCH /api/notes/update/:id | Update a note
// * @access | Private

// * @route | DELETE /api/notes/delete/:id | Delete a note
// * @access | Private

router.post('/new', token_verify, validate_note, create_note)
router.get('/get', token_verify, get_all_notes)
router.get('/get/:id', token_verify, get_note)
router.patch('/update/:id', token_verify, validate_note_update, update_note)
router.delete('/delete/:id', token_verify, delete_note)

export { router }