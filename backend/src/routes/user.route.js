import express from 'express';
import { signUp ,signIn, postJob} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/signIn', signIn);
userRouter.post('/postjob', authMiddleware, postJob);

export default userRouter;
