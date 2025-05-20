import passport, { use } from "passport";
import LocalStrategy from "passport-local";
import User from "../models/user.model";


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const isValidPassword = await bcrypt.compare(password, User.password);
            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;