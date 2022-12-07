import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { generateToken } from '../config/passport';

dotenv.config();

export const ping = (req: Request, res: Response) => {
    res.json({pong: true});
}

export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let { email, password } = req.body;

        let hasUser = await User.findOne({where: { email }});
        if(!hasUser) {
            let newUser = await User.create({ email, password });

            const token = generateToken({ id: newUser.id });

            //mesmo codigo do login (gerar token - SEM PASSPORT)
            /*
            const token = JWT.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' }
            );
            */

            res.status(201);
            res.json({ id: newUser.id, token });
        } else {
            res.json({ error: 'E-mail já existe.' });
        }
    }

    res.json({ error: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({ 
            where: { email, password }
        });

        if(user) {
            const token = generateToken({ id: user.id });
            res.json({ status: true, token })
            return;
        }
    }

    res.json({ status: false });
}


/* LOGIN FEITO PELO PASSPORT USANDO BASIC AUTH (A AUTENTICAÇÃO FICA TODA NO PASSPORT)
export const login = async (req: Request, res: Response) => {
    res.json({ status: true, user: req.user });
}
*/

/* Forma antiga, agora a autenticação está sendo feita pelo passport
export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({ 
            where: { email, password }
        });

        if(user) {

            const token = JWT.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' }
            );

            res.json({ status: true, 
                        user: user, 
                        token: token });
            return;
        }
    }

    res.json({ status: false });
}
*/
export const list = async (req: Request, res: Response) => {
    let users = await User.findAll();
    let list: string[] = [];

    for(let i in users) {
        list.push( users[i].email );
    }

    res.json({ list });
}