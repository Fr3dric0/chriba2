/**
 * @author      Fredrik F. Lindhagen <fred.lindh96@gmail.com>
 * @created     2017-01-10
 *
 * Sub-module for filehandler. Handles moving of files
 * */

const fs = require('fs');

module.exports = {
    /**
     * @param   {string}    oldPath     The path where the file lays
     * @param   {string}    newPath     The path where the file should be moved-
     *                                  N.B. Remember file-type.
     * Creates a read and writestream to pipe the data over to the new
     * destination. On success, the old file is removed. and Promise's
     * resolve method is called
     *
     * @return  {Object}    Promise. On resolve, return the new file-path
     * */
    mv(oldPath, newPath) {
        return new Promise((rsv, rr) => {
            const src = fs.createReadStream(oldPath);
            const dest = fs.createWriteStream(newPath);

            src.pipe(dest);

            src.on('error', (err) => rr(err));
            src.on('end', () => {
                fs.unlink(oldPath);
                rsv(newPath);
            });
        });
    }
};