const { JWTAuthController } = require('restful-node').controllers;

class ProjectController extends JWTAuthController {
    
    constructor (config) {
        config.pk = 'name';
        super('', config);
        
        this.ignoreMethods.push('list', 'retrieve');
        this.model = require('../models/projects');
    }
}

module.exports = ProjectController;