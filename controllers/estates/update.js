const Estates = require('../../models/estates');
const { findOne } = require('./find');

const update = [
    validateFields,
    findOne,
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

    // Find the included location fields
    for (const field of locationFields) {
        if (req.body[field]) {
            let str = `location.${field}`;
            changes[str] = req.body[field];
        }
    }

    if (!req.estates) {
        req.estates = {};
    }

    req.estates.query = { name: req.params.estate }; // Set the search query for `findOne`
    req.estates.changes = changes;
    next();
}

function updateEstate (req, res, next) {
    const { changes, estate } = req.estates;

    if (!estate) {
        const err = new Error(`[Estate Update Error] Cannot find estate: ${req.params.estate}`);
        err.status = 400;
        return next();
    }

    Estates.findOneAndUpdate( // Use findOneAndUpdate, to get the newest values
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