/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 22.10.2016.
 *
 */
const Projects = require('../../models/projects');
const Estates = require('../../models/estates');
const fh = require('../filehandler');
const shortid = require('shortid');

// list of valid mimetypes
const MIMETYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/svg+xml': 'svg' };


// An object of the Mongoose model-objects (providers)
// we have added support for
const PROVIDERS = {
    'projects': Projects,
    'estates': Estates
};

/**
 * @param   {Object}    db              A Mongoose model instance
 * @param   {Object}    opt             The request object
 *                                      Needs primarily the 'body', and 'file'
 *                                      part of 'req'
 * @param   {String}    name            The name of the element
 *                                      to place the new img-url in
 *
 * Uploads a single element to the UPLOAD_FOLDER.
 *      - The new file should have a filename formatted more or less like
 *        this: '<prefix>_<size>_<name>_<index>.<filetype>',
 *        which could to this: 'p_small_spongebob_0.jpg'
 * When the file is moved, upload the new url to the correct position in
 * the requested db.
 *
 * @return  {Object}    Promise. On resolve, the updated element
 * */
function single (db, opt, name) {
    //let Prov = PROVIDERS[provider];

    return new Promise((resolve, reject) => {
        let { size, file, root, publicPath } = opt;

        if (!db) {
            let err = new Error(`Provider: ${dber}, is not recognized`);
            err.status = 500;
            return reject(err);
        }

        if (!file) {
            let err = new Error(`Cannot find file to upload. 
            Please check the 'enctype' is correct, and input fields has the correct 'names'`);
            err.status = 400;
            return reject(err);
        }


        let filetype = '';
        try {
            filetype = fh.getFileType(file.mimetype, MIMETYPES);
        } catch (e) {
            return reject(e);
        }

        let targetPath = `${root}/${shortid.generate()}.${filetype}`;

        fh.mv(file.path, targetPath)
            .then(mvHandler)
            .catch((err) => {
                reject(err);
            });

        /**
         * @param   {String}    dest    Destination filepath
         * Inner-function, called when fh.mv succeeds.
         * Takes the filepath and pushes the url to the
         * Database-element
         * */
        function mvHandler (dest) {
            dest = `/${publicPath}${dest.substring(root.length, dest.length)}`;
            let query = {};
            switch (size) {
                case 'large':
                    query = {
                        $push: { 'thumbnails.large': dest }
                    };
                    break;
                case 'small':
                    query = {
                        $push: { 'thumbnails.small': dest }
                    };
                    break;
            }

            db.findOneAndUpdate(
                { name: name },
                query,
                { new: true },

                (err, updated) => {
                    if (err) {
                        console.error(err); // Log for debugging
                        return reject(err);
                    }

                    return resolve(updated);
                });
        }
    });

}


module.exports = {
    single: single,
    MIMETYPES: MIMETYPES
};