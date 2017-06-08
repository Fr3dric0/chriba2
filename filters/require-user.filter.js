const { Filter } = require('restful-node').auth;
const { BadRequestError, ForbiddenError } = require('restful-node').errors;

class RequireUserFilter extends Filter {

    constructor (model) {
        super();
        this.model = model;
    }
    
    async canAccess(req, res) {
        const { email, password } = req.body;
        
        if (!email) {
            throw new BadRequestError('Missing required field: "email"');
        }
        
        if (!password) {
            throw new BadRequestError('Missing required field: "password"');
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