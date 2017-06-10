const { FileController } = require('restful-node').controllers;
const { JWTFilter } = require('restful-node').auth;
const { HttpError } = require('restful-node').errors;
const saveThumbnail = require('../lib/save-thumbnail');
const destroyThumbnail = require('../lib/destroy-thumbnail');

/**
 * Generalized FileController built
 * to handle thumbnail uploads for estates and projects.
 * Only input needed from child-class is `config` and `model`.
 * @module  JWTAuthFileController
 * */
class JWTAuthFileController extends FileController {

    constructor (config = {}) {
        config.pk = 'file';
        super(':name', config);
        this.disable.push('list', 'retrieve', 'update');
        
        this.ignorePkOn.push('destroy'); // Safer to use the request body, or query params
        this.denyUploadOn.push('destroy');
        
        // Manually add the JWT-filter used by JWTAuthController
        this.authFilters.push(
            new JWTFilter(config.secret, config.ttl || 43200) // default: 12h
        );
    }
    
    /**
     * Uploads the file to the root location (config.root),
     * and saves a reference-url in the database
     * */
    async create(req, res, next) {
        if (!this.model) {
            return next(new HttpError('JWTAuthFileController missing required model'));
        }
        
        return saveThumbnail(req, res, next, this.model);
    }
    
    /**
     * Removes the file and reference from the file-root
     * and database
     * */
    async destroy(req, res, next) {
        if (!this.model) {
            return next(new HttpError('JWTAuthFileController missing required model'));
        }
        
        return destroyThumbnail(req, res, next, this.model);
    }
}

module.exports = JWTAuthFileController;