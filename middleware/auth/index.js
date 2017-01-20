const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin');

const authErr = new Error('[Authentication Error] Invalid token');
authErr.status = 403;

const requireToken = [
    validateToken,
    validateAdmin
];

function validateToken(req, res, next) {
    const token = req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.headers['authorization'];

    if (!token) {
        const err = new Error('[Authentication Error] Missing authorization token');
        err.status = 403;
        return next(err);
    }

    jwt.verify(token, req.config['token-secret'], (err, decoded) => {
        if (err) {
            authErr.description = `Token has probably expired`;
            return next(authErr);
        }

        req.decoded = decoded;
        next();
    });
}

function validateAdmin(req, res, next) {
    const { uid } = req.decoded;

    Admin.findById(uid)
        .then((admin) => {
            if (!admin) { // If no
                authErr.description = `Token has no valid admin linked to it`;
                return next(authErr);
            }
            next();
        })
        .catch( (err) => next(err));
}

module.exports = {

    /**
     * @Middleware
     *
     * Authenticates a request, by validating the provided token
     * */
    requireToken,

    /**
     * @param   {object}    pkg     The package to include in the token
     * @param   {string}    secret  The secret to sign the token with.
     *
     * Creates a new token, with the provided details
     * */
    generateToken(pkg, secret) {
        return jwt.sign(pkg, secret);
    }
};