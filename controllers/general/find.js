const About = require('../../models/about');

const find = [
    getAbout,
    returnData
];

function getAbout (req, res, next) {
    About.findAll()
        .then( (data) => {
            req.about = data;
            next();
        })
        .catch( err => next(err));
}

function returnData (req, res, next) {
    const { about } = req;

    return res.status(about ? 200 : 204).json(about);
}


module.exports = { find };