const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Kullanıcı şeması
const contentSchema = new Schema({
    title: { type: String, require}, // 'required' doğru kullanım
    content: { type: String, require},
    name: { type: String, require },
    path: { type: String, require},
    date: { type: String, require}
});

// Kullanıcı modeli
const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
