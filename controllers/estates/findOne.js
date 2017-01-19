const Estates = require('../../models/estates');

const findOne = [
    getQuery,
    findEstates,
    findOneEstate,
    returnEstate
];

function getQuery (req, res, next) {
    const { estate } = req.params;

    if (!req.estates) {
        req.estates = {};
    }
    req.estates.query = { name: estate };
    next();
}

function findEstates (req, res, next) {
    const { query } = req.estates;

    Estates.find(query)
        .then((estates) => {
            req.estates.estates = estates;
            next();
        })
        .catch(err => next(err));
}

function findOneEstate (req, res, next) {
    const { estates } = req.estates;

    if (estates.length < 1) {
        return res.status(204).json({});
    }

    const [ estate ] = estates;
    req.estates.estate = estate;
    next();
}

function returnEstate (req, res, next) {
    const { estate } = req.estates;
    res.status(200).json(estate);
}

module.exports = { findOne, findEstates };