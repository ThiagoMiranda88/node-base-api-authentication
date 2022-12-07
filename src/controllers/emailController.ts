import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
//import JWT from 'jsonwebtoken';
//import dotenv from 'dotenv';

//dotenv.config();



export const contato = async (req: Request, res: Response) => {

    //Passo 1: Configurar o transporter
    let transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "0bdb3bb2cc9b85",
            pass: "8941c90968a795"
        }
    });

    //Passo 2: Configurar a mensagem
    let message = {
        from: 'Thiago Miranda <thiagomiranda@gmail.com>',
        //from: 'nao-responda@gmail.com,
        //replyTo: req.body.from,
        to: 'teste@gmail.com, fulano@hotmail.com',
        subject: 'Assunto legal',
        //subject: req.body.subject,
        html: 'Opa <strong>Teste</strong>, como vai?',//para servidores que suportam html
        //subject: req.body.email,
        text: 'Opa Teste, como vai?' //caso nao suporte,usa esse
    }

    //Passo 3: Enviar a mensagem
    let info = await transport.sendMail(message);

    console.log("INFO", info)

    res.json({success: true});
}