import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minLength: [6, "password must be atleast 6 characters long"]
    },
    CreatedAt:{
        type: Date,
        default: Date.now
    },
    UpdatedAt:{
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next(); 
});

userSchema.methods.comparePassword = async (password) => {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

const User = mongoose.model('User', userSchema);

export default User;