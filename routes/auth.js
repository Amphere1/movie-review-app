import express from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

//user registration route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userNameExists = await User.findOne({ username });
        const emailExists = await User.findOne({ email });

        if (userNameExists || emailExists) {
            return res.status(400).json({ error: "username or email already exists" });
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
        }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        res.json({
            token,
            username: newUser.username
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'registration failed' });
    }
});

//user login route

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        //jwt token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' })
    }
});

//token verification route

router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorizaton?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Token verification failed' });
    }
});

export default router;