import dotenv from 'dotenv'
import { Command } from 'commander'

// sirve para configuraciones generales del server 
const program = new Command()
program.option('-m, --mode <mode>', 'Modo de ejecucion', 'prod')
program.parse()

dotenv.config({
    // aca le digo que si en el package.json esta el --mode dev lea el archivo de enterno dev, sino lea prod (aunq lo tengo como comando en el package lo q no tiene mucho snetido esto)
    // esto se utiliza para poder cambiar de entorno a la hora de llevar a prod
    // recordar que siempre deben tener las mismas variables los 2 env para que no explote todo
    path: program.opts().mode === 'dev'?'./.env.dev':'./.env.prod'
})


export default {
    app: {
        PORT: process.env.PORT || 8080,
        URL_BASE: process.env.URL_BASE || 'localhost:8080'
    },
    mongo: {
        MONGO_URI: process.env.MONGO_URI || 'localhost:8080'
    },
    users: {
        USER_ADMIN: process.env.USER_ADMIN,
        PASS_PASS: process.env.PASS_PASS
    }
}