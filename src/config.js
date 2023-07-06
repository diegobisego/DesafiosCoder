import dotenv from 'dotenv'
import { Command, program } from 'commander'

const program = new Command()
program.option('-m, --mode <mode>', 'Modo de ejecucion', 'prod')

dotenv.config()


export default {
    app: {
        PORT: process.env.PORT || 8080,
        URL_BASE: process.env.URL_BASE || 'localhost:8080'
    },
    mongo: {
        MONGO_URI: process.env.MONGO_URI || 'localhost:8080'
    }
}