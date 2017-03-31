const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannedRoute = new Schema({
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    created: { type: Date, default: Date.now }
});

/**
 * Gets all the _phrases_ (keys), and checks if the `word` contains any of them
 *
 * @param   {string}    word    The word, or url we would like to match the phrases with
 * @return  {Promise}
 */
BannedRoute.statics.search = function (word) {
    return new Promise((rsv, rr) => {
        this.find({}, { created: false })
            .then((results) => {
                // Look for a banned Route which
                // matches the word to an extent
                for (let r of results) {
                    if (!r.key) {
                        continue;
                    }


                    if (word.toLowerCase().indexOf(r.key) !== -1) {
                        return rsv(r);
                    }
                }

                return rsv(undefined);
            })
            .catch(err => rr(err));
    });
};


module.exports = mongoose.model('BannedRoute', BannedRoute);
