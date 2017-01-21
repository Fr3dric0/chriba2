const Estates = require('../../models/estates');
const { findOneEstate } = require('./findOne');

const update = [
    validateFields,
    findOneEstate,
    updateEstate,
    returnEstate
];

function validateFields (req, res, next) {
    const locationFields = ['address', 'addressNumber', 'postalCode', 'city', 'country'];
    const generalFields = ['description', 'size', 'url'];
    const changes = {};

    for (const field of generalFields) {
        if (req.body[field]) {
            changes[field] = req.body[field];
        }
    }

    for (const field of locationFields) {
        if (req.body[field]) {
            let str = `location.${field}`;
            changes[str] = req.body[field];
        }
    }

    if (!req.estates) {
        req.estates = {};
    }

    req.estates.changes = changes;
    next();
}

function updateEstate (req, res, next) {
    const { changes, estate } = req.estates;

    Estates.findOneAndUpdate(
        {_id: estate._id },
        { $set: changes },
        { new: true})
        .then((e) => {
            req.estates.estate = e;
            next();
        })
        .catch( err => next(err));
}

function returnEstate (req, res, next) {
    const { estate } = req.estates;

    res.status(200).json(estate);
}

module.exports = { update };