const Estates = require('../../models/estates');

const create = [
    validateFields,
    structureModel,
    saveEstate,
    returnEstate
];

function validateFields(req, res, next) {
    const fields = ['address'];
    const optionalFields = ['url', 'description', 'city', 'country', 'size', 'postalCode', 'addressNumber'];
    const estate = {};

    for (const field of fields) {
        if (!req.body[field]) {
            const err = new Error('[Estate Creation Error] Missing one or more of the required fields');
            err.status = 400;
            err.description = `Cannot find field ${field}`;
            return next(err);
        }

        // Store the fields in estate
        estate[field] = req.body[field];
    }

    // Get optional fields
    for (const field of optionalFields) {
        if (req.body[field]) {
            estate[field] = req.body[field];
        }
    }

    if (!req.estates) {
        req.estates = {};
    }
    req.estates.fields = estate;
    next();
}

function structureModel (req, res, next) {
    const { fields } = req.estates;
    const values = { location: {}};
    values.location.address = fields.address;
    values.location.addressNumber = fields.addressNumber || undefined;
    values.location.postalCode = fields.postalCode || undefined;
    values.location.city = fields.city || undefined;
    values.location.country = fields.country || undefined;

    values.description = fields.description;
    values.size = fields.size;

    req.estates.values = values;
    next();
}

function saveEstate (req, res, next) {
    const { values } = req.estates;

    Estates.create(values)
        .then((estate) => {
            req.estates.estate = estate;
            next();
        })
        .catch((err) => {
            if (err.message.startsWith('E11000')) {
                err = new Error(`[Estate save error] Estate: ${values.location.address} already exists`);
                err.status = 400;
            }
            next(err);
        })
}

function returnEstate (req, res, next) {
    const { estate } = req.estates;
    res.status(201).json(estate);
}

module.exports = { create };