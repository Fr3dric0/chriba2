const Admin = require('../../models/admin');

const update = [
    validateFields,
    updateAdmin
];

function validateFields (req, res, next) {
    const fields = ['firstName', 'lastName', 'email', 'oldPassword', 'password', 'confirmPassword'];
    const adm = {};

    for (const field of fields) {
        if (req.body[field]) {
            adm[field] = req.body[field];
        }
    }

    if (adm.password || adm.oldPassword || adm.confirmPassword) {
        if (!adm.password || !adm.oldPassword || !adm.confirmPassword) {
            const err = new Error(`[Admin Modify Error] Trying to update password, but missing one or more of the fields 'oldPassword', 'password', 'confirmPassword'`);
            err.status = 400;
            return next(err);
        }
    }

    req.admin = new Admin(adm);
    next();
}

function updateAdmin (req, res, next) {
    const { admin } = req;

    admin.save()
        .then( (adm) => {
            console.log(adm);
        })
        .catch( err => next(err));
}



module.exports = { update };