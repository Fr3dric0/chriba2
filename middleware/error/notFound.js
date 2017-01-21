
module.exports = {
    notFound(req, res, next){

        const err = new Error(`Cannot find path: ${req.url}`);
        err.status = 404;
        next(err);
    }

};