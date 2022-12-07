import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
//import { BasicStrategy } from 'passport-http';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { doesNotMatch } from 'assert';

dotenv.config();

const notAuthorizedJson = {status: 401, message: 'Não autorizado'};
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string
}


//Aqui é configurada a estrategia de autenticacao
//jwt strategy
passport.use(new JWTStrategy(options, async (payload, done)=> {

    const user = await User.findByPk(payload.id);
    if(user){
        return done(null, user);
    } else {
        return done(notAuthorizedJson);
    }    

}));

export const generateToken = (data: object)=> {
    return jwt.sign(data, process.env.JWT_SECRET_KEY as string)
};

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {

    const authFunction = passport.authenticate('jwt', (err, user)=> {
        req.user = user;
        if(user){
            next();
        } else {
            next(notAuthorizedJson);
        }
    });
    authFunction(req, res, next);
};


/* BASIC AUTH
passport.use(new BasicStrategy( async (email, password, done) => {

    if(email && password){

        const user = await User.findOne({
            where: { email, password }
        });
        if(user){
            return done(null, user);
        }

    }
    return done(notAuthorizedJson, false);
    //return done(null, user); paramertro 1: ERRO, parametro 2: quando tiver sucesso, o objeto do usuário

}));

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {

    const authFunction = passport.authenticate('basic', (err, user)=> {
        req.user = user;
        if(user){
            next();
        } else {
            next(notAuthorizedJson);
        }
        //return user ? next() : next(notAuthorizedJson); FORMA SIMPLIFICADA DO CODIGO
    });
    authFunction(req, res, next);

}
*/


export default passport;