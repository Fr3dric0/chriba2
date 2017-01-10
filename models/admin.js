/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 16.09.2016.
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bcrypt = require('bcryptjs');
const HASH_ROUNDS = 12;

const Admins = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now },
    last_active: { type: Date, default: Date.now }
});

/**
 *  @param  {String}    uid         Is the user id. I.E. ObjectId
 *  @param  {Function}  callback
 *
 *  Updates the last active-data of the user
 * */
Admins.statics.updateLastActive = function (uid, callback) {
    this.findOneAndUpdate({ _id: uid }, { last_active: new Date() }, { new: true }, function (err, doc) {
        if (err) {
            return callback(err);
        }

        return callback(null, doc.last_active);
    });
};

Admins.statics.verifyPassword = function (uid, pwd, callback) {
    this.findOne({ _id: uid }, (err, user) => {
        if (err) {
            return callback(err);
        }

        if (!user) {
            let userErr = new Error('No such user');
            userErr.status = 500;
            return callback(userErr);
        }

        Bcrypt.compare(pwd, user.password, (compErr, result) => {
            if (compErr) {
                return callback(new Error('Could not compare passwords'));
            }

            if (!result) {
                return callback(new Error('Password do not match'));
            }

            return callback(user._uid);
        });
    });

};

Admins.statics.hashField = function (pwd, callback) {
    Bcrypt.hash(pwd, HASH_ROUNDS, (err, hash) => {
        if (err) {
            return callback(err);
        }

        return callback(null, hash);
    });
};

/**
 *  @param  {String}    email       The users email
 *  @param  {String}    pwd         The users password, unhashed
 *  @param  {Function}  callback    The callback-function
 *
 *  Handles authentication of a user
 * */
Admins.statics.authenticate = function (email, pwd, callback) {

    this.findOne({ email: email }, (err, user) => {
        if (err) {
            return callback(err);
        }

        if (!user) {
            const userErr = new Error('Could not find user in DB');

            userErr.status = 403;

            return callback(userErr)
        }

        Bcrypt.compare(pwd, user.password, function (compareErr, result) {
            if (compareErr) {
                return callback(compareErr);
            }

            if (result) {
                user.password = ''; // Wipe the password from the response
                delete user.password;
                return callback(null, user);
            } else {
                const authErr = new Error('Admins not authenticated');
                authErr.status = 403;
                return callback(authErr);
            }
        });
    });
};


Admins.pre('save', function (next) {
    let adm = this;

    // Check if user aldready exists
    this.constructor.findOne({ email: this.email }, function (err, data) {
        if (err) {
            return next(err);
        }

        if (data) {
            let err = new Error('Admin already exist');
            err.status = 401;
            return next(err);
        }


        // Hash password, and save user
        Bcrypt.hash(adm.password, HASH_ROUNDS, function (hashErr, hash) {
            if (hashErr) {
                console.error(hashErr);
                return next(hashErr);
            }

            // Replace the password with the hashed version
            adm.password = hash;
            return next();
        });
    });


});

module.exports = mongoose.model('Admins', Admins);
