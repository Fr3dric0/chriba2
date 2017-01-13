const Admin = require('../../models/admin');
const { generateToken }= require('./token');

const register = [
    validateFields,
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

    if (admin.password !== admin.confirmPassword) {
        const err = new Error(`[Registration Error] Password fields do not match!`);
        err.status = 400;
        return next(err);
    }

    req.admin = new Admin(admin);
    next();
}


function saveAdmin (req, res, next) {
    const { admin } = req;

    admin.save()
        .then((adm) => {
            req.user = adm; // save as user, so that generateToken works
            next();
        })
        .catch( err => next(err));
}

function returnAdmin(req, res, next) {
    const { token } = req;
    res.status(201).json({success: true, token});
}


module.exports = { register };