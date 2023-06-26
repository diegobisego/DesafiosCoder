import passport from "passport";



// middleware para llamar a possport
export const passportCall = (strategy) => {
    return async(req,res,next) => {
        passport.authenticate(strategy, async (error,user, info) => {
            if (error) return next(error)  // si hay error
            if (!user) {
                res.status(200).send({status: false, error: info.message?info.message: info.toString()}) // false en user
            }
            req.user = user  //si existe, lo devuleve en req.user
            next()
        })(req,res,next)
    }
}


// midd para poder extraer el token de la cookie
export const cookieStractor = (req) => {
     let token = null // aca vien el token
     if (req && req.cookies) {
        token = req.cookies['authToken']
     }
     return token
}