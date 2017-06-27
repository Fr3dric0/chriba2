const JWTAuthFileController = require('./jwt-auth-file.controller');

/**
 * Enables Uploads and deletions of thumbnails connected to
 * the `estates-collection`
 * @module  estate-thumb.controller
 * */
class EstateThumbController extends JWTAuthFileController {
    
    constructor (config) {
        super(config);
        this.model = require('../models/estates');
    }
    
}

module.exports = EstateThumbController;