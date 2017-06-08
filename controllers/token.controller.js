const { AuthController } = require('restful-node').controllers;
const { JWT } = require('restful-node').auth;
const RequireUserFilter = require('../filters/require-user.filter');

class TokenController extends AuthController {
    constructor (config) {
        super('');
        this.model = require('../models/admin');
        
        this.disable.push('list', 'retrieve', 'update', 'destroy');
        
        this.secret = config.secret || '';
        this.ttl =  config.ttl || 21600; //ms (6 hours)
        this.jwt = new JWT(this.secret, this.ttl);
        
        this.authFilters.push(new RequireUserFilter(this.model));
    }
    
    async create(req, res, next) {
        const token = this.jwt.create({ uid: req.admin._id });
        res.status(200).json({ token });
    }
    
}

module.exports = TokenController;