import bcrypt from 'bcrypt';
import { Router } from "express";
import Joi from "joi";
import { User } from "../entities";
import { findUserByIdentifier, persistUser } from "../repository/user-repository";
import { generateToken } from '../security/token';

export const authController = Router();

const registerValidation = Joi.object<User>({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
});
const loginValidation = Joi.object<{username:string,password:string}>({
    username: Joi.string().required(),
    password: Joi.string().required()
});

authController.post('/api/user', async (req,res) => {
    try {
        const user =await registerValidation.validateAsync(req.body);
        
        if(await findUserByIdentifier(user.email) || await findUserByIdentifier(user.username)) {
            res.status(400).json({error: 'Email or Username already in use'});
            return;
        }
        user.role = 'ROLE_USER';
        user.password = await bcrypt.hash(user.password, 5);
        await persistUser(user);
        res.status(201).json(user);

    }catch(e) {
        if(e instanceof Joi.ValidationError) {
            res.status(400).json({error: e.details, message: e.message});
            return;
        }
        console.log(e);
        res.status(500).send('Server error');
    }
});


authController.post('/api/login', async (req,res) => {
    try{
        const credentials =await loginValidation.validateAsync(req.body);
 
        const user = await findUserByIdentifier(credentials.username);
        if(user) {
            const samePassword = await bcrypt.compare(req.body.password, user.password);
            if(samePassword) {
                res.json({
                    user,
                    token: generateToken({
                        username:user.username
                    })
                });
                return;
            }
        }
        res.status(401).json({error: 'Wrong email and/or password'});
    }catch(e) {
        
        if(e instanceof Joi.ValidationError) {
            res.status(400).json({error: e.details, message: e.message});
            return;
        }
        console.log(e);
        res.status(500).send('Server error');
    }
});
