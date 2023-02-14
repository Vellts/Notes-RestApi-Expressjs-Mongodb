import { Router } from "express";
import { get_token, login_user, logout, register_user } from "../controllers/auth.controller.js";
import { validate_login, validate_register } from "../middlewares/auth.middleware.js";
import { token_refresh_verify } from "../middlewares/token.middleware.js";

const router = Router()

router.post('/register', validate_register, register_user)
router.post('/login', validate_login, login_user)
router.get('/get_token', token_refresh_verify, get_token)
router.get('/logout', logout)

export { router }