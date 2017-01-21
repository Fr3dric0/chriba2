const Estates = require('../../models/estates');

const findAll = [
    getQuery,
    findEstates,
    returnVideos
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

function findEstates (req, res, next) {
    const { query } = req.estates;

    Estates.find(query)
        .then((estates) => {
            req.estates.estates = estates;
            next();
        })
        .catch( err => next(err));
}

function returnVideos (req, res, next) {
    const { estates } = req.estates;

    res.status(200).json(estates);
}

module.exports = { findAll, getQuery, findEstates };