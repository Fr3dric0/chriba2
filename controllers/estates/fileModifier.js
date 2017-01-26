const Estates = require('../../models/estates');
const uploader = require('../../lib/uploader');
const fh = require('../../lib/filehandler');
const { findOne } = require('./find');

const root = 'resources/uploads';
const publicPath = 'resource/uploads';
const validSize = ['large', 'small'];

const upload = [
    validateFields,
    uploadFile
];

function validateFields (req, res, next) {
    const { size } = req.params;

    if (!validSize.includes(size)) {
        const err = new Error(`[Estate Img Upload Error] Illegal size value: ${size}. Legal values ${validSize.join(', ')}`);
        err.status = 400;
        return next(err);
    }

    next();
}

function uploadFile (req, res, next) {
    const { estate, size } = req.params;
    const { file } = req;

    uploader.single('estates', {size, file, root, publicPath}, estate)
        .then((results) => {
            res.json(results);
        })
        .catch( err => next(err));
}


const remove = [
    validateDeleteFields,
    findOne,
    validateEstate,
    getThumbUrls,
    deleteThumbFiles,
    deleteThumbData,
    returnResults
];

function validateDeleteFields (req, res, next) {
    const { size, estate } = req.params;
    const { index } = req.body;

    if (!validSize.includes(size)) {
        const err = new Error(`[Estate Img Delete Error] Illegal size value: ${size}. Legal values ${validSize.join(', ')}`);
        err.status = 400;
        return next(err);
    }

    if (!req.estates) {
        req.estates = {};
    }


    req.estates.query = { name: estate }; // Used for search
    req.estates.size = size;
    req.estates.name = estate;
    req.estates.index = index;

    next();
}

function validateEstate (req, res, next) {
    const { size } = req.params;
    const { estate } = req.estates;

    if (!estate) {
        const err = new Error(`[Estate Img Delete Error] Cannot find estate: ${estate}`);
        err.status = 404;
        return next(err);
    }

    if (!estate.thumbnails || (!estate.thumbnails.large && !estate.thumbnails.small)) {
        const err = new Error(`[Estate Img Delete Error] No thumbnails exists on estate: ${estate}`);
        err.status = 400;
        return next(err);
    }

    // Validate that the thumbnail[size] exists
    if (!estate.thumbnails[size] || estate.thumbnails[size].length < 1) {
        const err = new Error(`[Estate Img Delete Error] No thumbnails in '${size}' exists in estate: ${estate.name}`);
        err.status = 400;
        return next(err);
    }

    next();
}


/**
 * @middleware
 * Maps all the thumb-urls to remove from `document`
 * */
function getThumbUrls (req, res, next) {
    const { index, size, estate } = req.estates;
    const { thumbnails } = estate;
    let paths = [];

    // Used for third party middleware
    if (!thumbnails[size]) {
        next();
    }

    if (!index) {
        paths = thumbnails[size]; // Should be checked before that thumbnails[size] exists
    } else {
        if (index > thumbnails[size].length - 1 || index < 0) {
            const err = new Error(`[Estate Img Delete Error] Index: ${index}, is out of range [0, ${thumbnails[size].length - 1}]`);
            err.status = 400;
            return next(err);
        }

        paths = [ thumbnails[size][index] ];
    }

    req.estates.paths = paths;
    next();
}

/**
 * @middleware
 * Removes all the files specified in `paths`,
 * from the resources folder
 * */
function deleteThumbFiles (req, res, next) {
    const { paths } = req.estates;

    // Used for middleware
    // Make them able to skip this function
    if (!paths) {
        next();
    }

    const deletePromises = paths.map((path) => {
        let p = path.substring(publicPath.length + 1);
        return fh.rm(`${root}${p}`);
    });

    Promise.all(deletePromises)
        .then((result) => next())
        .catch(err => next(err));

}

/***/
function deleteThumbData (req, res, next) {
    const { paths, size, estate } = req.estates;

    const deletePromises = paths.map((path) => {
        if (size == 'large') {
            return Estates.update({_id: estate._id}, {$pull: {'thumbnails.large': path} })
        } else {
            return Estates.update({_id: estate._id}, {$pull: {'thumbnails.small': path} })
        }
    });

    Promise.all(deletePromises)
        .then( result => next())
        .catch( err => next(err));
}

function returnResults (req, res, next) {
    const { paths } = req.estates;

    res.status(200).json(paths);
}

module.exports = { upload, remove, getThumbUrls, deleteThumbFiles };