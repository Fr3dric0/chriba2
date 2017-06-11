const { JWTAuthController } = require('restful-node').controllers;
const about = require('../models/about');

/**
 * Serves the general values (i.e. about)
 * */
class GeneralController extends JWTAuthController {
    
    constructor (config) {
        super('', config);
        this.ignoreMethods.push('list');
        this.ignorePkOn.push('update'); // Has only one about-document
        this.disable.push('retrieve', 'destroy', 'create');
    }
    
    /**
     * Retrieves the items in models/about/_about.json
     * */
    async list (req, res, next) {
        try {
            return res.status(200).json(await about.find());
        } catch (e) {
            return next(e);
        }
    }
    
    /**
     * Will update the fields in models/about/_about.json
     * */
    async update (req, res, next) {
        try {
            return res.status(200).json(await about.save(req.body));
        } catch (e) {
            return next(e);
        }
    }
    
}

module.exports = GeneralController;