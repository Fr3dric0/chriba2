const Projects = require('../../models/projects');
const { findOne } = require('./find');

const update = [
    validateFields,
    findOne,
    protectFields, // Must be before updateName
    updateName,
    updateProject,
    returnProject
];

function validateFields (req, res, next) {
    const requiredFields = ['title', 'thumbnails'];

    // Prevent user form removing required fields
    for (const field of requiredFields) {
        if (field in req.body) {
            if (isNull(req.body[field])) {
                const err = new Error(`[Project Update Error] Cannot remove required field: ${field}`);
                err.status = 400;
                return next(err);
            }
        }
    }

    if (!req.projects) {
        req.projects = {};
    }

    req.projects.query = { name: req.params.name}; // Set the search query for `findOne`
    next();
}



function protectFields (req, res, next) {
    const { project } = req.projects;

    if (!project) {
        const err = new Error(`[Project Update Error] Cannot find project: ${req.params.name}`);
        err.status = 400;
        return next(err);
    }
    
    // Ensure that these fields cannot be directly changed by the client
    req.body._id = project._id;
    req.body.__v = project.__v;
    req.body.name = project.name;

    next();
}

/**
 * When the `title` changes, the `name` should also change.
 * N.B. This will affect url paths to the data
 * */
function updateName (req, res, next) {
    const { title } = req.body;

    // Skip if title has not been changed
    if (!title) {
        return next();
    }

    req.body.name = Projects.generateName(title);
    next();
}

function updateProject (req, res, next) {
    const { project } = req.projects;

    Projects.findOneAndUpdate( // Use findOneAndUpdate, to get the newest values
        {_id: project._id },
        { $set: req.body },
        { new: true })
        .then((e) => {
            req.project = e;
            next();
        })
        .catch( err => next(err));
}

function returnProject (req, res, next) {
    const { project } = req;
    res.status(200).json(project);
}

function isNull(val) {
    if (!val) {
        return true;
    }

    return val === null || val === undefined || val === '';
}

module.exports = { update };