const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Kullanıcı şeması
const userSchema = new Schema({
    email: { type: String, require }, // 'required' doğru kullanım
    username: { type: String, require },
    password: { type: String, require}
});

// Kullanıcı modeli
const User = mongoose.model('User', userSchema);

module.exports = User;
