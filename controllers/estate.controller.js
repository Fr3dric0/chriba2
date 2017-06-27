const { JWTAuthController } = require('restful-node').controllers;

class EstateController extends JWTAuthController {
    
    constructor (config) {
        config.pk = 'name'; // The url is built on estate's `name`-field
        super('', config);
        
        // list and retrieve can be accessed without token
        this.ignoreMethods.push('list', 'retrieve');
        this.model = require('../models/estates');
    }
    
}

module.exports = EstateController;