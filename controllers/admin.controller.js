const { JWTAuthController } = require('restful-node').controllers;
const { BadRequestError } = require('restful-node').errors;

class AdminController extends JWTAuthController {
    
    constructor (config) {
        super('', { secret: config.secret, ttl: 100000 });
        
        this.model = require('../models/admin');
        this.ignoreMethods.push('create');
        
        // `update` and `destroy` uses authentication-header
        // and not the `id` url-param
        this.ignorePkOn.push('update', 'destroy');
        
        // Explicitly check for `false` value,
        // `null` and `undefined` is treated as `true`
        if (config.debug === false) {
            this.disable.push('create', 'destroy'); // Disables admin registration in production
        }
    }
    
    // GET /
    async list (req, res, next) {
        const { uid } = req.decoded.data;
        
        let admin;
        try {
            admin = await this.model.findById(uid);
        } catch (e) {
            return next(e);
        }
        
        admin.password = null;
        res.status(admin ? 200 : 404).json(admin);
    }
    
    // GET /:id
    // Returns the same as `list`
    async retrieve (req, res, next) {
        return await list(req, res, next);
    }
    
    async update (req, res, next) {
        const { uid } = req.decoded.data;
        
        // Validate admin fields
        try {
            await this.checkUpdate(uid, req.body);
        } catch (e) {
            return next(e);
        }
        
        if (req.body.password) {
            // Hash new password
            try {
                req.body.password = await this.model.hashField(req.body.password);
            } catch(e) {
                return next(e);
            }
        }
        
        let admin;
        try {
            admin = await this.model.findOneAndUpdate(
                { _id: uid },
                { $set: req.body },
                { new: true }
            );
        } catch (e) {
            return next(e);
        }
        
        admin.password = null;
        res.status(200).json(admin);
    }
    
    /**
     * Runs validation of the password fields.
     * */
    async checkUpdate(uid, admin) {
        if (!admin) { return; }
        
        if (!admin.password) {
            return;
        }
        
        if (admin.password && !admin.oldPassword) {
            throw new BadRequestError('Missing required field "oldPassword", when "password" is present');
        }
        
        if (admin.password && !admin.confirmPassword) {
            throw new BadRequestError('Missing required field "confirmPassword"')
        }
        
        if (admin.password !== admin.confirmPassword) {
            throw new BadRequestError('New Passwords do not match');
        }
        
        try {
            await this.model.verifyPassword(uid, admin.oldPassword);
        } catch (e) {
            throw new BadRequestError(e.message);
        }
        
    }
    
}

module.exports = AdminController;