/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 16.09.2016.
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bcrypt = require('bcryptjs');
const { BadRequestError } = require('restful-node').errors;
const HASH_ROUNDS = 12;

const Admins = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }
});

/**
 *  @param  {ObjectId}    uid     The user's id. (i.e. _id)
 *
 *  Updates the last active-data of the user
 *  @return {Promise}
 * */
Admins.statics.updateLastActive = function (uid) {
    return new Promise((rsv, rr) => {
        this.findOneAndUpdate({ _id: uid }, { lastActive: new Date() }, { new: true }, function (err, doc) {
            if (err) {
                return rr(err);
            }
            rsv(doc.lastActive);
        });
    });
};

/**
 * @param   {ObjectId}  uid     User's id
 * @param   {String}    pwd     The password to check
 *
 * Method meant to be used, when user wants to update
 * he's password, NOT to do login-authentication
 *
 * @return  {Promise}
 * */
Admins.statics.verifyPassword = function (uid, pwd) {
    return new Promise((rsv, rr) => {
        this.findOne({ _id: uid }, (err, user) => {
            if (err) {
                return rr(err);
            }
            
            if (!user) {
                let userErr = new Error('No such user');
                userErr.status = 500;
                return rr(userErr);
            }
            
            Bcrypt.compare(pwd, user.password, (compErr, result) => {
                if (compErr) {
                    return rr(new Error('Could not compare passwords'));
                }
                
                if (!result) {
                    return rr(new Error('Wrong password'));
                }
                
                return rsv(true);
            });
        });
    });
};

/**
 * @param   {String}    pwd     The password to hash
 *
 * Hashes a field like the password.
 * Used when admin is updated, because the password field is
 * not automatically hashed
 * @return {Promise}
 * */
Admins.statics.hashField = function (pwd) {
    return new Promise((rsv, rr) => {
        Bcrypt.hash(pwd, HASH_ROUNDS, (err, hash) => {
            if (err) {
                return rr(err);
            }
            
            return rsv(hash);
        });
    })
};


/**
 *  @param  {String}    email       The users email
 *  @param  {String}    pwd         The users password, unhashed
 *
 *  Handles authentication of a user
 *  @return {Promise}
 * */
Admins.statics.authenticate = function (email, pwd) {
    return new Promise((rsv, rr) => {
        this.findOne({ email: email }, (err, user) => {
            if (err) {
                return rr(err);
            }
            
            if (!user) {
                const userErr = new Error('Could not find user in DB');
                userErr.status = 403;
                return rr(userErr)
            }
            
            Bcrypt.compare(pwd, user.password, function (compareErr, result) {
                if (compareErr) {
                    return rr(compareErr);
                }
                
                if (result) {
                    user.password = ''; // Wipe the password from the response
                    delete user.password;
                    return rsv(user);
                } else {
                    const authErr = new Error('Admins not authenticated');
                    authErr.status = 403;
                    return rr(authErr);
                }
            });
        });
    })
};


Admins.pre('save', function (next) {
    let adm = this;
    
    // Hash password, and save user
    Bcrypt.hash(adm.password, HASH_ROUNDS, function (hashErr, hash) {
        if (hashErr) {
            return next(hashErr);
        }
        
        // Replace the password with the hashed version
        adm.password = hash;
        return next();
    });
    
});

// Post save without errors
Admins.post('save', function (doc, next) {
    this.password = null;
    next();
});

// Post save WITH errors
Admins.post('save', function (err, doc, next) {
    if (err.name === 'ValidationError') {
        return next(new BadRequestError(
            err.errors && err.errors.description ?
                err.errors.description.message :
                err
        ));
    }
    
    // Duplicate key error (Admin already exists)
    if (err.message.startsWith('E11000')) {
        return next(new BadRequestError(`Admin: ${doc.email} already exists`));
    }
    
    next();
});

// Post find, etc.
Admins.post('init', function (doc, next) {
    // Ensure the password
    // is never leaked
    // TODO:ffl - find a better way to prevent leakage
    // this.password = null;
    
    next();
});


module.exports = mongoose.model('Admins', Admins);
