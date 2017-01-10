/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 22.10.2016.
 *
 */
const fs = require('fs');
const PATH = 'models/about/_about.json';

function save(elem){
    return new Promise((resolve, reject) => {
        let jsonstr = '';
        try {
            jsonstr = JSON.stringify(elem);
        } catch (e) {
            return reject(e);
        }

        fs.writeFile(PATH, jsonstr, (err) => {
            if(err){
                return reject(e);
            }

            // If everything went ok, return the updated element
            return resolve(elem);
        })

    });
}

function findAll(){
    return new Promise((resolve, reject) => {
        fs.readFile(PATH, (err, data) => {
            if(err){
                return reject(err);
            }

            try{
                return resolve(JSON.parse(data));
            }catch(e){
                return reject(new Error('The about data has been malformed ' +
                    'and can therefore not be loaded.'));
            }
        });
    });
}


module.exports = {
    save,
    findAll
};