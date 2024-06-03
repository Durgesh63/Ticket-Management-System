const jwt = require("jsonwebtoken")
const { ACCESS_TOKEN_SECRET } = require("../constant")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const { RefreshToken } = require("../models/user/refreshToken.models")


const checkAuthUser = asyncHandler(async function (req, res, next) {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET)

    if (!decodedToken) {
        throw new ApiError(401, "Unauthorized request")
    }
    const refreshTokenInstances = new RefreshToken();
    const isRefreshToken = await refreshTokenInstances.getRefreshToken(decodedToken._id)
    if (!isRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    req.auth = {
        _id: decodedToken._id,
        token_id: isRefreshToken._id,
        userType: decodedToken.userType,
    };
    next()
})


module.exports = checkAuthUser