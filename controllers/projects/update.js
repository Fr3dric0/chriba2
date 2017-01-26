const Projects = require('../../models/projects');
const { findOne } = require('./find');

const update = [
    validateFields,
    findOne,
    updateName,
    updateProject,
    returnProject
];

function validateFields (req, res, next) {
    const fields = ['description', 'url', 'title'];
    const changes = {};

    for (const field of fields) {
        if (req.body[field]) {
            changes[field] = req.body[field];
        }
    }

    if (!req.projects) {
        req.projects = {};
    }

    req.projects.query = { name: req.params.name}; // Set the search query for `findOne`
    req.projects.changes = changes;
    next();
}

/**
 * When the `title` changes, the `name` should also change.
 * N.B. This will affect url paths to the data
 * */
function updateName (req, res, next) {
    const { changes } = req.projects;

    // Skip if title has not been changed
    if (!changes.title) {
        return next();
    }

    req.projects.changes.name = Projects.generateName(changes.title);
    next();
}

function updateProject (req, res, next) {
    const { changes, project } = req.projects;

    if (!project) {
        const err = new Error(`[Project Update Error] Cannot find project: ${req.params.name}`);
        err.status = 400;
        return next();
    }

    Projects.findOneAndUpdate( // Use findOneAndUpdate, to get the newest values
        {_id: project._id },
        { $set: changes },
        { new: true})
        .then((e) => {
            req.projects.project = e;
            next();
        })
        .catch( err => next(err));
}

function returnProject (req, res, next) {
    const { project } = req.projects;
    res.status(200).json(project);
}

module.exports = { update };