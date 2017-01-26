const Projects = require('../../models/projects');
const { getThumbUrls, deleteThumbFiles } = require('./fileModifier');

const remove = [
    validateProjectExistance,
    deleteSmallThumb,
    // thumbs for small
    getThumbUrls,
    deleteThumbFiles,
    deleteLargeThumb,
    // thumbs for large
    getThumbUrls,
    deleteThumbFiles,
    removeProject,
    returnResults
];

function validateProjectExistance (req, res, next) {
    const { name } = req.params;

    Projects.findOne({ name })
        .then((e) => {
            // No need to send an error. A 204 is more than enough
            if (!e) {
                return res.status(204).json({});
            }

            if (!req.projects) {
                req.projects = {};
            }
            req.projects.project = e;
            next();
        })
        .catch( err => next(err));
}

function deleteSmallThumb (req, res, next) {
    req.projects.paths = undefined; // Ensure no path already exists
    req.projects.size = 'small'; // Sets the small thumb to be removed
    next();
}

function deleteLargeThumb (req, res, next) {
    req.projects.paths = undefined; // Ensure no path exists
    req.projects.size = 'large'; // Set the next thumb to be removed
    next();
}

function removeProject (req, res, next) {
    const { _id } = req.projects.project;
    Projects.remove({ _id })
        .then((results) => {
            next();
        })
        .catch( err => next(err));
}

function returnResults (req, res, next) {
    res.status(200).json(req.projects.project);
}


module.exports = { remove };