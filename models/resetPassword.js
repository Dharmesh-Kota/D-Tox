const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: {
        type: String
    },
    isValid: {
        type: Boolean
    }
}, {
    timestamps: true
});

const resetPassword = mongoose.model('resetPassword', resetPasswordSchema);

module.exports = resetPassword;