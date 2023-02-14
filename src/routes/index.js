// get all the routes and use express router
import { Router } from "express";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cerror } from "../helpers/custom.console.js";

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const clear_file = (file, type) => {
    if (type === 1) return file.replace('.js', '')
    if (type === 2) return file.split('.')[0]
}

readdirSync(__dirname).forEach(async (file) => {
    const route = clear_file(file, 1)
    let failRoute = []
    if (route !== 'index') {
        try {
            failRoute.push(route)
            const route_import = await import(`./${file}`)
            const route_type = clear_file(file, 2)

            router.use(`/api/v${process.env.API_VERSION}/${route_type}`, route_import.router)
        } catch (error) {
            cerror(`Rutas registradas: ${failRoute}`)
            console.log(error)
            throw new Error('❎ | No se pudo cargar la ruta')
        }
    }
})

export default router