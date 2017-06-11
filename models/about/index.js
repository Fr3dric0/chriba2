/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 22.10.2016.
 *
 */


const fs = require('fs');
const path = require('path');
const { BadRequestError, HttpError } = require('restful-node').errors;

const PATH = path.join(__dirname, '_about.json'); // Absolute path to file

const rootFields = ['title', 'description', 'mobile', 'business', 'email', 'mailbox'];
const locationFields = ['address', 'addressNumber', 'postalCode', 'city', 'country', 'lat', 'long'];

const requiredRootFields = ['title'];
const requiredLocationFields = ['address', 'postalCode', 'city']; // Cannot find lat and long without these values

/**
 * Ensures no required values are removed
 * */
function _checkFields (f) {
    for (const field of requiredRootFields) {
        if (f.hasOwnProperty(field) &&
            (f[field] === null || f[field] === '' || f[field] === undefined)) {
            throw new BadRequestError(`Cannot remove required field '${field}'`);
        }
    }
    
    if ('location' in f) {
        const loc = f.location;
        
        for (const field of requiredLocationFields) {
            if (loc.hasOwnProperty(field) &&
                (loc[field] === null || loc[field] === '' || loc[field] === undefined)) {
                throw new BadRequestError(`Cannot remove required field 'location.${field}'`);
            }
        }
    }
}

/**
 * Ensures no unwanted values is added to the document
 * @param   {About}     elem    Current values
 * @param   {About}     f       New Values
 * @return  {About}     Updated document
 * */
function _mapFields (elem, f) {
    for (const field of rootFields) {
        if (field in f) { elem[field] = f[field]; }
    }
    
    // Map location field only if they have been changed
    if ('location' in f) {
        if (!elem.location) {
            elem.location = {};
        }
        
        for (const field of locationFields) {
            if (field in f.location) {
                elem.location[field] = f.location[field];
            }
        }
    }
    
    return elem;
}

/**
 * Updates about with the new values.
 * @param   {About}     elem
 * */
function save (elem) {
    return new Promise((rsv, rr) => {
        try {
            _checkFields(elem);
        } catch (e) {
            return rr(e);
        }
        
        // Get the current values
        find()
            .then((about) => {
                elem = _mapFields(about, elem);
    
                let jsonstr = '';
                try {
                    jsonstr = JSON.stringify(elem);
                } catch (e) {
                    return rr(e);
                }
    
                fs.writeFile(PATH, jsonstr, (err) => {
                    if (err) { return rr(err); }
        
                    // If everything went ok, return the new document
                    return rsv(elem);
                });
            })
            .catch(err => rr(err));
    });
}


/**
 * Loads the _about.json document
 * */
function find () {
    return new Promise((resolve, reject) => {
        fs.readFile(PATH, (err, data) => {
            if (err) {
                return reject(err);
            }
            
            try {
                return resolve(JSON.parse(data));
            } catch (e) {
                return reject(new HttpError('About has been malformed ' +
                    'and cannot be loaded'));
            }
        });
    });
}

module.exports = { save, find };
