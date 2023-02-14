
import mongoose, { connect } from "mongoose";

const connect_db = async () => {
    try {
        mongoose.set("strictQuery", false)
        connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log("✅ | Conectado a la base de datos."))
    } catch (error) {
        console.log(error)
    }
}

export { connect_db }