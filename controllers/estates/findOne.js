const Estates = require('../../models/estates');
const { findEstates, getQuery } = require('./findAll');

const findOne = [
    getQuery,
    findEstates,
    findOneEstate,
    returnEstate
];

function findOneEstate (req, res, next) {
    const { estate } = req.params;

    Estates.findOne({name: estate})
        .then((e) => {
            if (!e) {
                return res.status(204).json({});
            }

            req.estates.estate = e;
            next();
        })
        .catch( err => next(err));
}

function returnEstate (req, res, next) {
    const { estate } = req.estates;
    res.status(200).json(estate);
}

module.exports = { findOne, findOneEstate };