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
        URL_BASE: process.env.URL_BASE || 'localhost:8080',
        PERSISTENCE: process.env.PERSISTENCE || 'MONGO'
    },
    mongo: {
        MONGO_URI: process.env.MONGO_URI || 'localhost:8080'
    },
    users: {
        USER_ADMIN: process.env.USER_ADMIN,
        PASS_PASS: process.env.PASS_PASS
    },
    github: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        CALL_BACK_URL: process.env.CALL_BACK_URL,
        SESSION: process.env.SESSION
    },
    token: {
        TOKEN_SECRET: process.env.TOKEN_SECRET
    },
    email: {
        APP_MAIL: process.env.APP_MAIL,
        APP_PASSWORD: process.env.APP_PASSWORD
    },
    sms: {
        TWILIO_NUMBER:process.env.TWILIO_NUMBER,
        TWILIO_SID:process.env.TWILIO_SID,
        TWILIO_TOKEN:process.env.TWILIO_TOKEN,
        TWILIO_CLIENT_NUMBER: process.env.TWILIO_CLIENT_NUMBER

    }
}