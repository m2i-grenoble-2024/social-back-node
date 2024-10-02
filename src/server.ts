import express from 'express';
import cors from 'cors';
import { configurePassport } from './security/token';
import passport from 'passport';
import { authController } from './controller/auth-controller';
import { postController } from './controller/post-controller';
export const server = express();

configurePassport();
server.use(express.json({limit:'10mb'}));
server.use(cors());
server.use(passport.initialize());
server.use(express.static('public'));


server.use(authController)
server.use('/api/post', postController);