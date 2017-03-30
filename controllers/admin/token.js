const Admins = require('../../models/admin');
const auth = require('../../middleware/auth');

const authenticate = [
    validateAuthFields,
    authAdmin,
    updateActivity,
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
            if (e.status === 403) {
                err = new Error(`[Authentication Error] Email or password is invalid!`);
                err.status = 403;
            } else {
                err = e; // If this is an internal error return that err-msg
            }
            next(err);
        })
}

function updateActivity (req, res, next) {
    const { user } = req;

    Admins.updateLastActive(user._id)
        .then((lastActive) => {
            user.lastActive = lastActive;
            next();
        })
        .catch(err => {console.error(err); next();});
}

function generateToken (req, res, next) {
    const { user, config } = req;
    req.token = auth.generateToken({ uid: user._id }, config['token-secret']);
    next();
}

function returnToken (req, res, next) {
    const { token } = req;

    res.status(200).json({ success: true, token });
}

module.exports = { authenticate, generateToken };