const { Filter } = require('restful-node').auth;
const { BadRequestError } = require('restful-node').errors;

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
            // UERR 100 is the bad password error.
            // Every other error is unknown or critical
            if (!e.message.startsWith('[UERR 100]')) {
                console.error(e);
            }
            throw e;
        }
        req.admin = admin;
    }
}

module.exports = RequireUserFilter;