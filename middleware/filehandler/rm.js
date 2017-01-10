const fs = require('fs');

module.exports = {
    rm (path) {
        return new Promise((rsv, rr) => {
            fs.unlink(path, (err) => {
                if (err) { return rr(err); }
                rsv(true);
            })
        });
    }
};