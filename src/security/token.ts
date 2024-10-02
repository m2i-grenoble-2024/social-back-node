import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { findUserByIdentifier } from '../repository/user-repository';


interface UserPayload {
    username:string;
}

/**
 * Fonction qui génère un JWT en se basant sur la clef privée.
 * Il est actuellement configuré pour expiré au bout de 1H (60*60 secondes) mais ça peut être modifié
 * @param {object} payload le body qui sera mis dans le token
 * @returns le JWT
 */
export function generateToken(payload: UserPayload, expire = 60*60) {
    const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: expire });
    return token;
}

/**
 * Fonction qui configure la stratégie JWT de passport, il va chercher le token dans les headers de la 
 * requête en mode {"authorization":"Bearer leToken"}
 */
export function configurePassport() {
    passport.use(new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (payload: UserPayload, done) => {
        try {
            const user = await findUserByIdentifier(payload.username);
            
            if(user) {
               
                return done(null, user);
            }
            
            return done(null, false);
        } catch (error) {
            console.log(error);
            return done(error, false);
        }
    }))

}
