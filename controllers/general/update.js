const About = require('../../models/about');

const update = [
    getAbout,
    validateFields,
    saveData,
    returnData
];

function getAbout (req, res, next) {
    About.findAll()
        .then((data) => {
            if (!req.about) {
                req.about = {};
            }

            req.about.data = data;
            next();
        })
        .catch( err => next(err));
}

function validateFields (req, res, next) {
    const generalFields = ['title', 'description', 'mobile', 'business', 'email', 'mailbox'];
    const locationFields = ['address', 'addressNumber', 'postalCode', 'city', 'country'];

    for (const field of generalFields) {
        if (req.body[field]) {
            req.about.data[field] = req.body[field];
        }
    }

    for (const field of locationFields) {
        if (req.body[field]) {
            if (!req.about.data.location) {
                req.about.data.location = {};
            }

            req.about.data.location[field] = req.body[field];
        }
    }

    next();
}



function saveData (req, res, next) {
    const { data } = req.about;

    About.save(data)
        .then( about => next() )
        .catch( err => next(err) );
}

function returnData (req, res, next) {
    const { data } = req.about;

    res.status(200).json(data);
}


module.exports = { update };