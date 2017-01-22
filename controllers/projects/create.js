const Projects = require('../../models/projects');

const create = [
    validateFields,
    structureModel,
    saveProject,
    returnProject
];

function validateFields (req, res, next) {
    const fields = ['title'];
    const optionalFields = ['url', 'description'];
    const project = {};

    for (const field of fields) {
        if (!req.body[field]) {
            const err = new Error('[Project Creation Error] Missing one or more of the required fields');
            err.status = 400;
            err.description = `Missing: ${field}`;
            return next(err);
        }

        // Store the fields in project
        project[field] = req.body[field];
    }

    // Get optional fields
    for (const field of optionalFields) {
        if (req.body[field]) {
            project[field] = req.body[field];
        }
    }

    if (!req.projects) {
        req.projects = {};
    }
    req.projects.fields = project;
    next();
}

function structureModel (req, res, next) {
    const { fields } = req.projects;
    const values = { location: {}};

    values.title = fields.title;
    values.description = fields.description;
    values.url = fields.url;

    req.projects.values = values;
    next();
}

function saveProject (req, res, next) {
    const { values } = req.projects;

    Projects.create(values)
        .then((project) => {
            req.projects.project = project;
            next();
        })
        .catch((err) => {
            if (err.message.startsWith('E11000')) {
                err = new Error(`[Estate save error] Estate: ${values.title} already exists`);
                err.status = 400;
            }
            next(err);
        })
}

function returnProject (req, res, next) {
    const { project } = req.projects;
    res.status(201).json(project);
}

module.exports = { create };