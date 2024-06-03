const mongoose = require('mongoose');

const refreshToken = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15d'
    },
});

refreshToken.methods.deleteToken = async function (_id) {
    return await this.model('RefreshToken').deleteOne({ _id: _id });
}
refreshToken.methods.getRefreshToken = async function (userId) {
    return await RefreshToken.findOne({ userId: userId })
}
const RefreshToken = mongoose.model('RefreshToken', refreshToken);

module.exports = { RefreshToken };

