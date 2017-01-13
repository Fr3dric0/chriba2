/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 22.10.2016.
 *
 */
const Projects = require('../../models/projects');
const Estates = require('../../models/estates');
const fh = require('./filehandler');

// list of valid mimetypes
const MIMETYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/svg+xml': 'svg' };
// The final destination for the files
const UPLOAD_FOLDER = 'public/img/uploads';
// Valid prefixes for the size
const SIZES = ['large', 'small'];
// An object of the Mongoose model-objects (providers)
// we have added support for
const PROVIDERS = {
    'projects': Projects,
    'estates': Estates
};

/**
 * @param   {Object}    provider    A Mongoose model-object
 * @param   {Object}    req         The request object
 *                                  Needs primarily the 'body', and 'file'
 *                                  part of 'req'
 * @param   {String}    name        The name of the element
 *                                  to place the new img-url in
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
function single(provider, req, name) {
    let body = req.body;
    let file = req.file;
    let Prov = PROVIDERS[provider];

    return new Promise((resolve, reject) => {

        if (!Prov) {
            let err = new Error(`Provider: ${provider}, is not recognized`);
            err.status = 500;
            return reject(err);
        }

        if (!body.size || (SIZES.indexOf(body.size) === -1)) {
            let err = new Error(`Illegal value in input-field: size = ${body.size}`);
            err.status = 400;
            return reject(err);
        }

        if (!file) {
            let err = new Error(`Cannot find file to upload. 
            Please check the 'enctype' is correct, and input fields has the correct 'names'`);
            err.status = 400;
            return reject(err);
        }

        if (!body) {
            let err = new Error(`Cannot find request body.
            Please check the 'entype' and input fields`);
            err.status = 400;
            return reject(err);
        }

        const tmp_path = file.path;

        fh.generate_file_name(Prov, provider.substring(0, 1), body.size, name)
            .then((filename) => {

                let filetype = '';
                try {
                    filetype = fh.getFileType(file.mimetype, MIMETYPES);
                } catch (e) {
                    return reject(e);
                }

                let target_path = `${UPLOAD_FOLDER}/${filename}.${filetype}`;

                fh.mv(tmp_path, target_path)
                    .then(mv_handler)
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));

        /**
         * @param   {String}    dest    Destination filepath
         * Inner-function, called when fh.mv succeeds.
         * Takes the filepath and pushes the url to the
         * Database-element
         * */
        function mv_handler(dest) {
            dest = dest.substring('public'.length, dest.length);

            let query = {};
            switch (body.size) {
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

            Prov.findOneAndUpdate(
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