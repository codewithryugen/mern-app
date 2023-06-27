import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utills/generateToken.js";

export const authUser = expressAsyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPasswords(password))){
        generateToken(res,user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        });
    }else{
        res.status(401);
        throw new Error('invalid email or password');
    }

});

export const registerUser = expressAsyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User Is exists');
    }
    const user = await User.create({
       name,
       email,
       password 
    })
    if(user){
        generateToken(res,user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        });
    }else{
        res.status(400);
        throw new Error('invalid data');
    }
});

export const logoutUser = expressAsyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:'logget out'});
});

export const getUserProfile = expressAsyncHandler(async(req,res)=>{
    const {_id,name,email} = req.user;
    const user = {
        _id,
        name,
        email
    }
    res.status(200).json(user);
});

export const updateUserProfile = expressAsyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updateUser = await user.save();
        res.status(200).json({
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
        })
    }else{
        res.status(404);
        throw new Error('user not found');
    }
});

