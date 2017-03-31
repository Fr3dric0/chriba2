/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 21.10.2016.
 *
 * Middleware for handling modification of uploaded files.
 * Used extensively in the middleware ./uploader.js
 *
 */
const fs = require('fs');
const shortid = require('shortid');
const mv = require('./mv').mv;
const rm = require('./rm').rm;

const SEPPERATOR = '-';

/**
 * @param   {Object}    provider    Mongoose model-object
 * @param   {String}    prefix      A prefix in from of the filename
 *                                  e.g. 'p' for projects, 'e' for estates, etc...
 * @param   {String}    size        A size-string, to prefix the filename with. E.g. 'small' or 'large'
 *                                  !IMPORTANT!: The function uses this param to,
 *                                  find the correct element in the database
 * @param   {String}    name        This is the name we use to find the element
 *                                  in the db
 *
 * Based on the input values and the length of the list. The function generates
 * a unique, yet readable, filename (without file-type).
 *
 * @return {Object}     Promise. On resolve, return the filename
 * */
function generateFileName (provider, prefix, size, name) {
    return new Promise((resolve, reject) => {

        // Keep everything lowercase
        prefix = prefix.toLowerCase();
        size = size.toLowerCase();

        provider.findOne({ name })
            .then((data) => {

                if (!data) {
                    let err = new Error(`Element: ${name} do not exist in database`);
                    err.status = 400;
                    return reject(err);
                }

                const hash = shortid.generate();
                return resolve(hash);
            })
            .catch( err => reject(err));
    });

}

/**
 * @param   {string}    name        Name to check
 * @param   {String[]}  thumbnails  The list to check
 *
 * Checks if _string element_ in `thumbnails` contains `name`
 * @return  {boolean}
 * */
function exists (name, thumbnails) {
    for (const thumb of thumbnails) {
        if (thumb.indexOf(name) !== -1) {
            return true;
        }
    }
    return false;
}

/**
 * @param   {String}    type        mimetype we want to trim to a simple filetype
 * @param   {Object}    mimetypes   All the valid mimetypes.
 *
 * In mimetypes the 'key' is the string-equivalent of the mimetype,
 * and the 'value' is equal to the filetype we want in return.
 * Should we fail to find the filetype, an Error gets thrown
 *
 * @throws  {Error}
 * @return  {String}    A usable filetype
 * */
function getFileType (type, mimetypes) {

    let filetype = mimetypes[type.toLowerCase()];

    if (!filetype) {
        throw new Error(`Illegal filetype: ${type}`);
    }

    return filetype;
}

module.exports = {
    mv,
    rm,
    generateFileName,
    getFileType
};