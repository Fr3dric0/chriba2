const Estates = require('../../models/estates');

const create = [
    validateHeader,
    saveEstate,
    returnEstate
];

function validateHeader (req, res, next) {

    if (req.headers['content-type'] !== 'application/json') {
        const err = new TypeError(`[Estate Create Error] Unsupported Content-Type: ${req.headers['content-type']}`);
        err.description = `We currently only support 'application/json'`;
        err.status = 400;
        return next(err);
    }

    next();
}

function saveEstate (req, res, next) {
    const e = new Estates(req.body);

    e.save()
        .then((item) => {
            req.estate = item;
            next();
        })
        .catch((err) => {
            if (err.message.startsWith('E11000')) {
                const duplicateErr = new Error(`[Estate Save Error] Estate: ${e.location.address} already exists`);
                duplicateErr.status = 400;
                return next(duplicateErr);
            }

            next(err);
        });
}

function returnEstate (req, res, next) {
    const { estate } = req;
    res.status(201).json(estate);
}

module.exports = { create, validateHeader };