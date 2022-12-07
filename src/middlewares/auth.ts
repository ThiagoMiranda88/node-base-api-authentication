import { Request, Response , NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction ) => {
        
        let success = false;

        //fazer verificação de auth
        
        if(req.headers.authorization ){
            
            const [authType, token] = req.headers.authorization.split(' '); //Padrão da string-> bearer sfvaewrg35y3grdbeth
            if(authType === 'Bearer'){
                
                try{
                    JWT.verify(
                        token, 
                        process.env.JWT_SECRET_KEY as string
                    );
                    success = true;

                } catch(err) {
                   
                }

            }
        }

        if(success){
            next(); //deixar a rota prosseguir (api.ts)
        } else {
            res.status(403); //not authorized
            res.json({ error: 'Não autorizado.'});
        }

    }
}

//Auth feito com Basic Auth (Busca o usuário e senha no banco em todas as requisições)
/*
export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction ) => {
        
        let success = false;

        //fazer verificação de auth
        
        if(req.headers.authorization ){
            let hash: string = req.headers.authorization.substring(6); //string padrão: Basic dGhpYWdvbWlyYW5kYUBnbWFpbC5jb206MTIzNA== -> REMOVER O 'Basic'
            let decoded: string = Buffer.from(hash, 'base64').toString(); //string thiagomiranda@gmail.com:1234
            let data: string[] = decoded.split(':');

            if(data.length === 2 ){

                let hasUser = await User.findOne({
                    where: {
                        email: data[0],
                        password: data[1]
                    }
                });
                if(hasUser){
                    success = true;
                }
            }
        }

        if(success){
            next(); //deixar a rota prosseguir (api.ts)
        } else {
            res.status(403); //not authorized
            res.json({ error: 'Não autorizado.'});
        }

    }
}
*/