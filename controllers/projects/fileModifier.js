const Projects = require('../../models/projects');
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
        const err = new Error(`[Project Img Upload Error] Illegal size (${size}) for thumb. Legal values ${validSize.join(', ')}`);
        err.status = 400;
        return next(err);
    }

    next();
}

function uploadFile (req, res, next) {
    const { name, size } = req.params;
    const { file } = req;

    uploader.single(Projects, {size, file, root, publicPath}, name)
        .then((results) => res.status(201).json(results))
        .catch( err => next(err));
}


const remove = [
    validateDeleteFields,
    findOne,
    validateProject,
    getThumbUrls,
    deleteThumbFiles,
    deleteThumbData,
    findOne,
    returnResults
];

function validateDeleteFields (req, res, next) {
    const { size, name } = req.params;
    const { index } = req.body;

    if (!validSize.includes(size)) {
        const err = new Error(`[Project Img Delete Error] Illegal size value: ${size}. Legal values: ${validSize.join(', ')}`);
        err.status = 400;
        return next(err);
    }

    if (!req.projects) {
        req.projects = {};
    }

    req.projects.query = { name }; // Used for search
    req.projects.size = size;
    req.projects.name = name;
    req.projects.index = index;

    next();
}

function validateProject (req, res, next) {
    const { size } = req.params;
    const { project } = req.projects;

    if (!project) {
        const err = new Error(`[Project Img Delete Error] Cannot find project: ${project}`);
        err.status = 404;
        return next(err);
    }

    if (!project.thumbnails || (!project.thumbnails.large && !project.thumbnails.small)) {
        const err = new Error(`[Project Img Delete Error] No thumbnails exists on project: ${project}`);
        err.status = 400;
        return next(err);
    }

    // Validate that the thumbnail[size] exists
    if (!project.thumbnails[size] || project.thumbnails[size].length < 1) {
        const err = new Error(`[Project Img Delete Error] No thumbnails in '${size}' exists in project: ${project.title}`);
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
    const { index, size, project } = req.projects;
    const { thumbnails } = project;
    let paths = [];

    // Used for third party middleware
    if (!thumbnails[size]) {
        return next();
    }

    if (!index && index !== 0) {
        const err = new Error(`[Project Img Delete Error] Cannot find item to remove in index: ${index}`);
        err.status = 400;
        return next(err);
    }

    if (index === 'all') {
        paths = thumbnails[size];

    } else {
        if (index > thumbnails[size].length - 1 || index < 0) {
            const err = new Error(`[Project Img Delete Error] Index: ${index}, is out of range [0, ${thumbnails[size].length - 1}]`);
            err.status = 400;
            return next(err);
        }

        paths = [ thumbnails[size][index] ];
    }

    req.projects.paths = paths;
    next();
}

/**
 * @middleware
 * Removes all the files specified in `paths`,
 * from the resources folder
 * */
function deleteThumbFiles (req, res, next) {
    const { paths } = req.projects;

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
    const { paths, size, project } = req.projects;

    const deletePromises = paths.map((path) => {
        if (size === 'large') {
            return Projects.update({_id: project._id}, {$pull: {'thumbnails.large': path} })
        } else {
            return Projects.update({_id: project._id}, {$pull: {'thumbnails.small': path} })
        }
    });

    Promise.all(deletePromises)
        .then( result => next())
        .catch( err => next(err));
}

function returnResults (req, res, next) {
    const { project } = req.projects;

    res.status(200).json(project);
}

module.exports = { upload, remove, getThumbUrls, deleteThumbFiles };