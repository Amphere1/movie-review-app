import passport from "passport";

const verifyToken = passport.authenticate('jwt', {session: false});

export default verifyToken;