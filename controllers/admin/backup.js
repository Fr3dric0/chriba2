
const Admin = require('../../models/admin');


module.exports = {

    backup (req, res, next) {
        Admin.find({})
            .then((data) => {
                res.status(200).json(data);
            })
            .catch( err => next(err));
    }

};