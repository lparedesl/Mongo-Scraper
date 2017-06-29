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
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

module.exports = mongoose.model('Saved', schema);