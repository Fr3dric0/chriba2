const Estates = require('../../models/estates');

const find = [
    getQuery,
    findAll,
    findOne,
    returnEstate
];

function getQuery (req, res, next) {
    const { estate } = req.params;
    const query = {};

    if (estate) {
        query.name = estate;
    }

    if (!req.estates) {
        req.estates = {};
    }
    req.estates.query = query;
    next();
}

function findAll (req, res, next) {
    const { query } = req.estates;

    if (query.name) {
        return next();
    }

    Estates.find(query)
        .then((estates) => {
            req.estates.estates = estates;
            next();
        })
        .catch( err => next(err));
}

function findOne (req, res, next) {
    const { query } = req.estates;

    if (!query.name) {
        return next();
    }

    Estates.findOne(query)
        .then((estate) => {
            req.estates.estate = estate;
            next();
        })
        .catch( err => next(err));
}

function returnEstate (req, res, next) {
    const { estates, estate } = req.estates;

    if (!estate && (!estates || estates.length < 1)) {
        return res.status(204).json({});
    }

    res.status(200).json(estates || estate); // return either one of them
}

module.exports = { find, findOne, findAll };