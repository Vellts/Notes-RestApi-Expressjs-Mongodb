import { Router } from "express";
import { delete_user, get_user, get_users, update_user } from "../controllers/admin.controller.js";
import { is_admin, validate_update_user } from "../middlewares/admin.middleware.js";
import { token_verify } from "../middlewares/token.middleware.js";

const router = Router()

// Routes
// * route | GET /api/admin | Get all users
// * route | GET /api/admin/:id | Get a user
// * route | PATCH /api/admin/update/:id | Update a user
// * route | DELETE /api/admin/delete/:id | Delete a user

router.get('/users', token_verify, is_admin, get_users)
router.get('/users/:id', token_verify, is_admin, get_user)
router.patch('/users/update/:id', token_verify, is_admin, validate_update_user, update_user)
router.delete('/users/delete/:id', token_verify, is_admin, delete_user)

export { router }