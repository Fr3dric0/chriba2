/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 16.09.2016.
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Estates = new Schema({
    name: { type: String, unique: true },
    location: {
        address: { type: String },
        addressNumber: String,
        postalCode: String,
        city: String,
        country: { type: String, default: 'Norway' },
        lat: Number,
        long: Number
    },
    description: { type: String },
    size: { type: Number },
    url: String,
    thumbnails: {
        small: [],
        large: []
    },
    uploaded: { type: Date, default: Date.now }
});


Estates.pre('save', function (next) {
    try {
        validate(this);
    } catch (e) {
        console.log(e);
        return next(e);
    }

    this.name = createName(this.location);
    next();
});



function validate(estate) {
    const requiredLocations = ['address'];

    if (!estate.location) {
        throw new Error(`Missing required location-fields: ${requiredLocations.join(', ')}`);
    }

    for (let loc of requiredLocations) {
        if (!estate.location[loc]) {
            throw new Error(`Missing required location-field: ${loc}`);
        }
    }
}


/**
 *  @param {Object}    location    An object, containing properties such as: address, address_number and city
 *
 *  Creates a unique name for the object. based on the address, address number, and the city.
 *  This can be used as a human readable identifier for each object
 *
 *  @return {String}   Name for each model instance
 * */
function createName (location) {
    let name = '';

    if (location.address && location.address != '') {
        name += location.address;
    }

    if (location.address_number) {
        name += '_' + location.address_number;
    }

    if (location.city && location.city != '') {
        name += '_' + location.city;
    }

    name = snakeifyString(name);
    return name.toLowerCase();
}

function snakeifyString (str) {
    let new_str = '';

    str.split('').forEach((c) => {
        if (c == ' ') {
            new_str += '_';
        } else {
            new_str += c;
        }
    });

    return new_str;
}

module.exports = mongoose.model('Estates', Estates);
