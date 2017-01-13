const Admin = require('../../models/admin');

const findByUid = [validateUid, findAdmin, returnAdmin];

function validateUid (req, res, next) {
    const { uid } = req.decoded;

    if (!uid) {
        const err = new Error('[Admin Error] Cannot find uid. Please ensure you are authenticated');
        err.status = 400;
        return next(err);
    }
    next();
}

function findAdmin (req, res, next) {
    const { uid } = req.decoded;

    Admin.findById(uid)
        .then((admin) => {
            if (!admin) {
                const err = new Error('[Admin Error] Cannot find current, logged in, admin');
                err.status = 500;
                return next(err);
            }

            req.admin = admin;
            next();
        })
        .catch(err => next(err));
}

function returnAdmin ({ admin }, res, next) {
    const { _id, firstName, lastName, email, lastActive, created } = admin;

    res.status(200).json({
        _id,
        firstName,
        lastName,
        email,
        lastActive,
        created
    });
}

module.exports = { findByUid };