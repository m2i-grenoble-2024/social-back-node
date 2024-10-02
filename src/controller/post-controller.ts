import { Router } from "express";
import { findAllPosts } from "../repository/post-repository";
import Joi from "joi";
import { Post, User } from "../entities";
import passport from "passport";


export const postController = Router();

const postValidation = Joi.object<Post>({
    content: Joi.string().required()
});

postController.get('/', async (req,res) => {
    try {
        res.json(await findAllPosts());
    }catch(e) {
        console.log(e);
        res.status(500).send('Server error');
    }
});

postController.post('/', passport.authenticate('jwt', {session:false}), async (req,res) => {
    try {
        const post =await postValidation.validateAsync(req.body);
        post.postedAt = new Date();
        post.author = req.user as User;
        
        res.status(201).json(post);

    }catch(e) {
        if(e instanceof Joi.ValidationError) {
            res.status(400).json({error: e.details, message: e.message});
            return;
        }
        console.log(e);
        res.status(500).send('Server error');
    }
})