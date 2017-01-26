const Estates = require('../../models/estates');
const { getThumbUrls, deleteThumbFiles } = require('./fileModifier');


const remove = [
    validateEstateExistance,
    deleteSmallThumb,
    getThumbUrls,
    deleteThumbFiles,
    deleteLargeThumb,
    getThumbUrls, // Run twice, for small and large thumbs
    deleteThumbFiles,
    removeEstate,
    returnResults
];

function validateEstateExistance (req, res, next) {
    const { estate } = req.params;

    Estates.findOne({name: estate})
        .then((e) => {
            // No need to send an error. A 204 is more than enough
            if (!e) {
                return res.status(204).json({});
            }

            if (!req.estates) {
                req.estates = {};
            }
            req.estates.estate = e;
            next();
        })
        .catch( err => next(err));
}

function deleteSmallThumb (req, res, next) {

    req.estates.paths = undefined;
    req.estates.size = 'small';
    next();
}

function deleteLargeThumb (req, res, next) {
    req.estates.paths = undefined;
    req.estates.size = 'large';

    next();
}

function removeEstate (req, res, next) {
    const { estate } = req.estates;
    Estates.remove({_id: estate._id})
        .then((results) => {
            next();
        })
        .catch( err => next(err));
}

function returnResults (req, res, next) {
    const { estate } = req.estates;

    res.status(200).json(estate);
}




module.exports = { remove };