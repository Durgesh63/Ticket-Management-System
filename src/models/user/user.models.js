const mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require('../../constant');
const { RefreshToken } = require('./refreshToken.models');
const ApiError = require('../../utils/ApiError');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already in use'],
        index: true,
        trim: true
    },
    mobileNo: {
        type: Number,
        required: true,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        require: [true, "Password is required"],
    },
    picture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
    },

}, { timestamps: true });


userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.isUserExist = async function (email) {
    return await User.findOne({ email: email });
}

userSchema.methods.createAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            userType: this.userType,
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.createRefreshToken = async function () {
    try {
        const refreshTokenInstances = new RefreshToken();
        const isRefreshToken = await refreshTokenInstances.getRefreshToken(this._id)
        if (isRefreshToken) {
            return isRefreshToken?.refreshToken
        }

        const jwtrefreshtoken = jwt.sign(
            {
                _id: this._id,
            },
            REFRESH_TOKEN_SECRET,
            {
                expiresIn: REFRESH_TOKEN_EXPIRY
            }
        )
        const refreshTokenInstance = new RefreshToken({
            refreshToken: jwtrefreshtoken,
            userId: this._id
        })
        const refreshToken = await refreshTokenInstance.save()
        return refreshToken?.refreshToken;

    } catch (error) {
        throw new ApiError(500, error)
    }
}



userSchema.plugin(aggregatePaginate);


const User = mongoose.model('User', userSchema);

module.exports = {
    User
}
