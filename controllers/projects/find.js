const Projects = require('../../models/projects');

const find = [
    getQuery,
    findAll,
    findOne,
    returnData
];

function getQuery (req, res, next) {
    const { name } = req.params;
    const query = {};

    if (name) {
        query.name = name;
    }

    if (!req.projects) {
        req.projects = {};
    }
    req.projects.query = query;
    next();
}

function findAll (req, res, next) {
    const { query } = req.projects;

    // name is unique, skip to findOne
    if (query.name) {
        return next();
    }

    Projects.find(query)
        .then((projects) => {
            req.projects.projects = projects;
            next();
        })
        .catch( err => next(err));
}

function findOne (req, res, next) {
    const { query } = req.projects;

    if (!query.name) {
        return next();
    }

    Projects.findOne(query)
        .then((project) => {
            req.projects.project = project;
            next();
        })
        .catch( err => next(err));
}

function returnData (req, res, next) {
    const { projects, project } = req.projects;

    if (!project && (!projects || projects.length < 1)) {
        return res.status(204).json({});
    }

    res.status(200).json(projects || project); // return either one of them
}

module.exports = { find, findOne, findAll };
