var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    img: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Saved', schema);