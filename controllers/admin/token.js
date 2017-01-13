const Admins = require('../../models/admin');
const auth = require('../../middleware/auth');

const authenticate = [
    validateAuthFields,
    authAdmin,
    generateToken,
    returnToken
];

function validateAuthFields (req, res, next) {
    const fields = ['email', 'password'];

    for (const field of fields) {
        if (!req.body[field]) {
            const err = new Error(`[Authentication Error] Missing fields 'email' or 'password'`);
            err.status = 403;
            return next(err);
        }
    }

    next();
}

function authAdmin (req, res, next) {
    const { email, password } = req.body;
    Admins.authenticate(email, password)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((e) => {
            let err;
            if (e.status == 403) {
                err = new Error(`[Authentication Error] Email or password is invalid!`);
                err.status = 403;
            } else {
                err = e; // If this is an internal error return that err-msg
            }
            next(err);
        })
}

function generateToken (req, res, next) {
    const { user, config } = req;
    req.token = auth.generateToken({ uid: user._id }, config['token-secret']);
    next();
}

function returnToken (req, res, next) {
    const { token } = req;

    res.status(200).json({ succes: true, token });
}

module.exports = { authenticate, generateToken };