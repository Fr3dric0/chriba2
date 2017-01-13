const Admin = require('../../models/admin');
const { generateToken }= require('./token');

const register = [
    validateFields,
    validatePassword,
    saveAdmin,
    generateToken,
    returnAdmin
];

function validateFields (req, res, next) {
    const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    const admin = {};

    for (let field of fields) {
        if (!req.body[field]) {
            const err = new Error(`[Registration Error] Missing one or more of the input fields ${fields.join(', ')}`);
            err.status = 400;
            return next(err);
        }

        admin[field] = req.body[field]; // Set fields in admin object
    }

    req.admin = admin;
    next();
}

function validatePassword (req, res, next) {
    const { password, confirmPassword } = req.admin;

    if (password !== confirmPassword) {
        const err = new Error(`[Registration Error] Password fields do not match!`);
        err.status = 400;
        return next(err);
    }

    try {
        _validatePassword(password);
    } catch (e) {
        return next(e);
    }

    next();
}


function saveAdmin (req, res, next) {
    const { admin } = req;

    Admin.create(admin)
        .then((adm) => {
            req.user = adm; // save as user, so that generateToken works
            next();
        })
        .catch(err => {
            const e = new Error(`[Registration Error] Admin already exists`);
            e.description = `Admin with the email: ${admin.email} already exists`;
            e.status = err.status;
            next(e)
        });
}

function returnAdmin (req, res, next) {
    const { token } = req;
    res.status(201).json({ success: true, token });
}

function _validatePassword (pwd) {

    if (pwd.length <= 8 || !_passwordContainsNumber(pwd) || !_passwordContainsUppAndLowerCase(pwd)) {

        const err = new Error(`[Registration Error] Password requirements are not met!`);
        err.description = `Password length must be longer than 8, contain at least one number, and upper- and lower-case letters`;
        err.status = 400;
        throw err;
    } else {
        return pwd;
    }
}

function _passwordContainsNumber (pwd) {
    const matches = pwd.match(/\d+/g);
    return matches !== null;
}

function _passwordContainsUppAndLowerCase (pwd) {
    let hasUpper = false;
    let hasLower = false;
    const pwdLst = pwd.split('');

    for (let c of pwdLst) {
        // Stop iteration, when these conditions are met
        if (hasUpper && hasLower) {
            break;
        }

        if (_passwordContainsNumber(c)) {
            continue; // A number can disrupt test, therefore skip if num
        }

        if (!hasUpper) {
            hasUpper = !/[A-Z]/.test(c);
        }
        if (!hasLower) {
            hasLower = !/[a-z]/.test(c);
        }
    }

    return (hasUpper && hasLower);
}


module.exports = { register, _validatePassword };