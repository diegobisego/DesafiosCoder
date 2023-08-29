import nodemailer from 'nodemailer';
import config from '../config/config.js';
import DMailInfo from '../constants/DMailInfo.js';
import {generateMailTemplate} from '../helpers/generateMailTemplate.js'

export default class MailingService {
    constructor() {
        this.mailer = nodemailer.createTransport({
            service:'gmail',
            port:587,
            auth:{
                user: config.email.APP_MAIL,
                pass: config.email.APP_PASSWORD
            }
        })
    }

    sendMail = async(emails,template,payload) => {
        const mailInfo = DMailInfo[template];
        const html = await generateMailTemplate(template,payload);
        const result = await this.mailer.sendMail({
            from: 'Diego Bisego <diegobisego@gmail.com>',
            to: emails,
            html,
            ...mailInfo
        })
        return result;
    }
}