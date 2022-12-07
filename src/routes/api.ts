import { Router } from 'express';
import { privateRoute } from '../config/passport';
import { Auth } from '../middlewares/auth';
import * as ApiController from '../controllers/apiController';
import * as EmailController from '../controllers/emailController';

const router = Router();

router.post('/ping', ApiController.ping);

router.post('/register', ApiController.register);
router.post('/login', ApiController.login);

//router.get('/list', Auth.private ,ApiController.list); //forma 1 de autenticação ( sem usar o passport)
router.get('/list', privateRoute, ApiController.list); //autenticação usando o passport

router.post('/contato', EmailController.contato);

export default router;