const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BannedRoute = require('./bannedRoute');

const maxAttempts = 3;

const Blacklisted = new Schema({
    route: { type: Schema.Types.ObjectId, required: true },
    created: { type: Date, default: Date.now },
    banned: { type: Boolean, default: false },
    ip: { type: String, required: true, unique: true },
    attempts: [] // DateTime when client attempted to reach a blacklisted page
});

/**
 * Checks if a client exists, and if it is banned.
 *
 * @return {Promise}    in the format { banned: boolean, client: Blacklisted }
 * */
Blacklisted.statics.isBanned = function (ip) {
    return new Promise((rsv, rr) => {
        this.findOne({ ip }, { banned: true, attempts: true })
            .then((client) => {
                if (!client) {
                    return rsv({ banned: false, client: undefined });
                }

                if (client.banned) {
                    return rsv({ client, banned: true });
                }

                if (client.attempts.length > maxAttempts) {
                    return ban(client);
                }

                return rsv({ client, banned: false});
            })
            .catch( err => rr(err))
    });
};

/**
 * Creates a record for a blacklisted client
 * */
Blacklisted.statics.blacklist = function (ip, route, banned = false) {
    return new Promise((rsv, rr) => {
        const query = {
            ip,
            route,
            banned
        };

        this.create(query)
            .then((client) => rsv(client))
            .catch((err) => {
                if (err.message.startsWith('E11000')) {
                    err = new Error(`Client (${ip}) is already baned`);
                    err.status = 400;
                }
                rr(err);
            });
    });
};

/**
 * @param   {ObjectId}      id          Id of the object
 * @param   {Blacklisted}   referrer    An existing Blacklisted object
 *                                      which will, if included,
 *                                      be updated and returned
 * Increments the attempts
 * @return  {Promise}
 * */
Blacklisted.statics.addAttempt = function (id, referrer = null) {
    return new Promise((rsv, rr) => {
        const query = {};
        const date = new Date();

        // Updates the 'banned' status, if attempts has reached the maxAttempts
        if (referrer && referrer.attempts.length >= maxAttempts) {
            attempts = referrer.attempts;
            attempts.push(date);

            query.$set = {
                banned: true,
                attempts
            };

            // Update referrer
            referrer.banned = true;
            referrer.attempts = attempts;
        } else {
            query.$push = { attempts: date };
        }

        this.update({ _id: id }, query )
            .then((results) => {
                if (referrer) {
                    return rsv({ banned: referrer.banned, client: referrer });
                }

                rsv(date);
            })
            .catch( err => rr(err));
    });
};

Blacklisted.pre('save', function (next) {
    let self = this;

    self.attempts = [new Date()];

    BannedRoute.findOne({_id: self.route })
        .then((route) => {
            if (!route) {
                const err = new Error(`Cannot find a banned route matching id: ${self.route}, for client: ${self.ip}`);
                err.status = 500;
                return next(err);
            }

            next();
        })
        .catch(err => next(err));
});

/**
 * Helper function for banning new clients
 * */
function ban(client) {
    return new Promise((rsv, rr) => {
        this.update( {_id: client._id}, {$set: { banned: true }})
            .then(() => {
                rsv({client, banned: true});
            })
            .catch((err) => rr(err));
    });
}

module.exports = mongoose.model('Blacklisted', Blacklisted);
