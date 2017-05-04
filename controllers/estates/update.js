const Estates = require('../../models/estates');
const { findOne } = require('./find');
const { validateHeader } = require('./create');

const update = [
    validateHeader,
    validateFields,
    findOne,
    updateEstate,
    returnEstate
];

function validateFields (req, res, next) {
    /**
     * Prevent user from removing required fields in the location object
     * */
    const locationFields = ['address'];

    /**
     * Checked on the root level.
     * Prevent a user from removing required or data-generated fields.
     * */
    const protectedFields = ['name', '_id', 'location', 'thumbnails'];

    for (const field of protectedFields) {
        if (field in req.body) {
            if (isNull(req.body[field])) {
                const err = new Error(`[Estate Update Error] Cannot remove protected field: ${field}`);
                err.status = 400;
                return next(err);
            }
        }
    }

    if (req.body.location) {
        // Find the included location fields
        for (const field of locationFields) {
            const f = req.body.location[field];

            if (field in req.body.location) {
                if (isNull(f)) {
                    const err = new Error(`[Estate Update Error] Cannot remove required field: ${field}`);
                    err.status = 400;
                    return next(err);
                }
            }
        }
    }

    if (!req.estates) {
        req.estates = {};
    }
    req.estates.query = { name: req.params.estate }; // Neccesary field for`findOne`
    next();
}

function updateEstate (req, res, next) {
    const { estate } = req.estates;

    if (!estate) {
        const err = new Error(`[Estate Update Error] Cannot find estate: ${req.params.estate}`);
        err.status = 400;
        return next(err);
    }
    
    // Ensure that these fields cannot be directly changed by the client
    req.body._id = estate._id;
    req.body.__v = estate.__v;
    req.body.name = estate.name;

    Estates.findOneAndUpdate(
        {_id: estate._id },
        { $set: req.body },
        { new: true})
        .then((e) => {
            req.estate = e;
            next();
        })
        .catch( err => next(err));
}

function returnEstate (req, res, next) {
    const { estate } = req;
    res.status(200).json(estate);
}


function isNull(val) {
    if (!val) {
        return true;
    }

    return val === null || val === undefined || val === '';
}

module.exports = { update };