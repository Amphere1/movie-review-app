import express from "express";
import User from "../models/user.model";
import Router from "express";
import passport from "passport";
import jwt from "jsonwebtoken";


Router.post('/register', async (req,res) => {
    try{
        const {username, email, password} = req.body;

        const userNameExists = await User.findOne({username});
        const emailExists = await User.findOne({email});

        if(userNameExists || emailExists){
            return res.status(400).json({ error: "username or email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({
            userId: newUser._id
        },process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            token,
            username: newUser.username
        });

    } catch(error){
        console.log(error);
        res.status(500).json({error: 'registration failed'});
    }
});