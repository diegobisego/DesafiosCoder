import __dirname from '../dirname.js';
import fs from 'fs';
import Handlebars from 'handlebars';

;

export const generateMailTemplate = async(template,payload) =>{
    const content = await fs.promises.readFile(`${__dirname}/templates/${template}.handlebars`,'utf-8')
    const precompiledContent = Handlebars.compile(content);
    const compiledContent = precompiledContent({...payload})
    return compiledContent;
}