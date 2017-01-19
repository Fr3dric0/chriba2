const Estates = require('../../models/estates');

const create = [];

function validateFields(req, res, next) {
    const fields = ['address', 'addressNumber', 'postalCode', 'city', 'country', 'about', 'size'];
    const estate = {};

    for (const field of fields) {
        if (!req.body[field]) {
            const err = new Error('[Estate Register Error] Missing one or more of the required fields');
            err.status = 400;
            err.description = `Cannot find field ${field}`;
            return next(err);
        }

        // Store the fields in estate
        estate[field] = req.body[field];
    }

    req.estates.fields = estate;
    next();
}



module.exports = { create };