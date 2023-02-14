import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./src/routes/index.js"
import {connect_db} from"./src/helpers/db.manager.js"
import cookieParser from "cookie-parser"
import morgan from "morgan"

const app = express()
const port = process.env.PORT || 3000

// Connection to the database.
connect_db()



// Middlewares
app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)
app.use(express.static("public"))


// Starting the server.
app.listen(port, () => {
    console.log(`✅ | Servidor listo en el puerto ${port}`)
})