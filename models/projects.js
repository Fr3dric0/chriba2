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
    description: String,
    url: String,
    iconUrl: { type: String, default: null },
    thumbnails: {
        small: [],
        large: []
    },
    uploaded: { type: Date, default: Date.now }
});

Projects.pre('save', function (next) {
    this.name = createName(this.title);
    next();
});

Projects.statics.generateName = createName;

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