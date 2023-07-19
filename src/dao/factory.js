const persistence = process.env.PERSISTENCE

export default class PersistenceFactory {

    static async getPersistence() {
        let userDAO
        switch (persistence) {
            case 'FS':
            const {default: fsDAO = await import('./fileSystem/manager/ProductManager.js')}    
                break;

            case 'MONGO':
        
            default:
                break;
        }

    }

}