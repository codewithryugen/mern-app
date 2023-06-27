import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const protect = expressAsyncHandler(async(req,res,next)=>{
    let token;

    token = req.cookies.jwt;

    if(token){
        try{
            const decoded = jwt.verify(token,process.env.SECRET_KEY);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        }catch(err){
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }
    }else{
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});