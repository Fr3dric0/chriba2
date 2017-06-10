const { Filter } = require('restful-node').auth;
const { BadRequestError, ForbiddenError } = require('restful-node').errors;

/**
 * Ensures a user with the given login
 * credentials actually exists.
 *
 * Attaches `admin` to `req` if so.
 * */
class RequireUserFilter extends Filter {

    constructor (model) {
        super();
        this.model = model;
    }
    
    async canAccess(req, res) {
        const { email, password } = req.body;
        
        if (!email || !password) {
            throw new BadRequestError(!email ?
                'Missing required field: "email"' :
                'Missing required field: "password"');
        }
        
        let admin;
        try {
            admin = await this.model.authenticate(email, password);
        } catch (e) {
            throw new ForbiddenError('Wrong email or passsword');
        }
        
        req.admin = admin;
    }
}

module.exports = RequireUserFilter;