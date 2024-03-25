const passport = require("passport");

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
};

exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }



    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzdmZWQ0ODJmODkyNTJhY2FmMDNlMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA3NjA1NzE2fQ.c4-J1rKcCKIZGdfGKsD0e7uZRJ2RD3QqfUGqRhxucMQ"

    return token;
};
