const JWTAuthFileController = require('./jwt-auth-file.controller');

/**
 * Enables Uploads and deletions of thumbnails connected to
 * the `projects-collection`
 *
 * @module  estate-thumb.controller
 * */
class ProjectThumbController extends JWTAuthFileController {
    
    constructor (config) {
        super(config);
        this.model = require('../models/projects');
    }
}

module.exports = ProjectThumbController;