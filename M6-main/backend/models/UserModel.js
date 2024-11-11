const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'editor'],
        default: 'user', // Tutti gli utenti registrati sono 'user' di default
        required: false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true,
    },
    dob: {
        type: Date,
        required: false,
        default: new Date()
    },
}, { timestamps: true, strict: true });

module.exports = mongoose.model('UserModel', UserSchema, 'users');
