const Admin = require('../../models/admin');

const remove = [
    findAdmin,
    removeAdmin,
    returnFeedback
];

function findAdmin(req, res, next) {
    const { uid } = req.decoded;

    Admin.findById(uid)
        .then((admin) => {
             if (!admin) {
                 const err = new Error('[Admin Delete Error] Cannot find admin');
                 err.status = 500;
                 err.description = 'Admin do not exist, or has probably already been deleted';
                 return next(err);
             }

             req.admin = admin;
             next();
        })
        .catch( err => next(err));
}

function removeAdmin(req, res, next) {
    const { admin } = req;

    Admin.remove({ _id: admin._id })
        .then(({result}) => {
            next();
        })
        .catch( err => next(err));
}

function returnFeedback(req, res, next) {
    const { admin } = req;
    res.status(200).json(admin);
}

module.exports = { remove };