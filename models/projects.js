/**
 * @author: Fredrik Førde Lindhagen <fred.lindh96@gmail.com>
 * @created: 16.09.2016.
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Projects = new Schema({
    name: { type: String, unique: true },
    title: { type: String, required: true },
    about: String,
    url: String,
    icon_url: { type: String, default: null },
    thumbnails: {
        small: [],
        large: []
    },
    uploaded: { type: Date, default: Date.now },
    visits: { type: Number, default: 0 }
});

Projects.pre('save', function (next) {
    this.name = createName(this.title);
    next();
});

function createName (title) {
    let name = '';

    title.split('').forEach((c) => {
        if (c === ' ') {
            name += '_';
        } else {
            name += c.toLowerCase();
        }
    });

    return name;
}


module.exports = mongoose.model('Projects', Projects);