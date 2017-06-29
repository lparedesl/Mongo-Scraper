var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Note', schema);