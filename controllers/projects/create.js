const Projects = require('../../models/projects');

const create = [
    validateFields,
    saveProject,
    returnProject
];

function validateFields (req, res, next) {
    const fields = ['title'];

    for (const field of fields) {
        if (!req.body[field]) {
            const err = new Error('[Project Creation Error] Missing one or more of the required fields');
            err.status = 400;
            err.description = `Missing: ${field}`;
            return next(err);
        }
    }

    next();
}

function saveProject (req, res, next) {
    Projects.create(req.body)
        .then((project) => {
            req.project = project;
            next();
        })
        .catch((err) => {
            if (err.message.startsWith('E11000')) {
                err = new Error(`[Project Save Error] Project: ${values.title} already exists`);
                err.status = 400;
            }
            next(err);
        })
}

function returnProject (req, res, next) {
    const { project } = req;
    res.status(201).json(project);
}

module.exports = { create };