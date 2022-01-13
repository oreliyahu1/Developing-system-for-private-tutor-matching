const expressJwt = require('express-jwt');
const projectConfig = require('./config');
const User = require('./models/user.model');

function jwt() {
    return expressJwt({ secret : projectConfig.jwtSecret, isRevoked : isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/favicon.ico',
            '/api/users/login',
            '/api/users/forgotpassword',
            '/api/users/signup',
            '/api/questionnaires/getlastsq',
            '/api/questionnaires/getlasttq',
            '/api/faqs/all',
            '/api/courses/all',
            '/api/certificates/all',
        ]
    });
}

function isRevoked(req, payload, done) {
    if(!Number(payload.id))
        return done(new Error('Invalid token'));
        User.findById(Number(payload.id), (err, result) => {
        if(err) return done(err);
        if (!result) { return done(new Error('missing_secret')); }
        return done(false, null);
        //return done(false, projectConfig.jwtSecret);
    });
};

module.exports = jwt;