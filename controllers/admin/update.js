const Admin = require('../../models/admin');
const { _validatePassword } = require('./register');

const update = [
    validateFields,
    validatePassword,
    hashPassword,
    updateAdmin,
    returnUpdatedAdmin
];

function validateFields (req, res, next) {
    const fields = ['firstName', 'lastName', 'email', 'oldPassword', 'password', 'confirmPassword'];
    const adm = {};

    for (const field of fields) {
        if (req.body[field]) {
            adm[field] = req.body[field];
        }
    }

    // Ensure if one of the password field exists
    // the other fields also exists
    if (adm.password || adm.oldPassword || adm.confirmPassword) {
        if (!adm.password || !adm.oldPassword || !adm.confirmPassword) {
            const err = new Error(`[Admin Modify Error] Trying to update password, but missing one or more of the fields 'oldPassword', 'password', 'confirmPassword'`);
            err.status = 400;
            return next(err);
        }
    }

    req.admin = adm;
    next();
}

function validatePassword (req, res, next) {
    const { uid } = req.decoded;
    const { admin } = req;

    if (!admin.password) {
        return next(); // Skip to next process
    }

    if (admin.password !== admin.confirmPassword) {
        const err = new Error('[Admin Modify Error] New Password fields do not match');
        err.status = 400;
        return next(err);
    }

    try {
        _validatePassword(admin.password);
    } catch (e) {
        e.message = '[Admin Modify Error] Password requirements are not met';
        return next(e);
    }

    Admin.verifyPassword(uid, admin.oldPassword)
        .then(() => next())
        .catch((err) => {
            const e = new Error('[Admin Modify Error] Old password is not valid!');
            e.status = 403;
            next(e);
        })
}

function hashPassword (req, res, next) {
    const { admin } = req;
    if (!admin.password) {
        return next();
    }

    Admin.hashField(admin.password)
        .then((hash) => {
            req.admin.password = hash;
            next();
        })
        .catch(err => next(err));
}

function updateAdmin (req, res, next) {
    const { uid } = req.decoded;
    const { admin } = req;

    Admin.findOneAndUpdate(
        { _id: uid },
        { $set: admin },
        { new: true })
        .then((adm) => {
            if (!adm) {
                const err = new Error(`[Admin Modify Error] Cannot find current admin`);
                err.status = 404;
                throw err;
            }

            const { firstName, lastName, email, lastActive } = adm;
            req.admin = { firstName, lastName, email, lastActive }; // Replace the old admin
            next();
        })
        .catch(err => next(err));
}

function returnUpdatedAdmin (req, res, next) {
    const { admin } = req;

    res.status(200).json(admin);
}

module.exports = { update };