const { OPTIONS } = require('../../constant');
const Image = require('../../models/tools/image.models');
const { RefreshToken } = require('../../models/user/refreshToken.models');
const { User } = require('../../models/user/user.models');
const ApiError = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { checkVaoidEmail, isValidPassowrd, validatePassword } = require('../../utils/utils');

// @desc Genrate access & refresh token
//@access local
const generateAccessTokenAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    if (user?.isBlock) {
        throw new ApiError(403, "This user account is blocked for some unusual actions.")
    }
    const accessToken = await user.createAccessToken()
    const refreshToken = await user.createRefreshToken()
    return { accessToken, refreshToken }
}

// @desc Register 
// @route POST /api/v1/register
// @access Public
const register = asyncHandler(async (req, res) => {

    const { name, email, password, mobileNo, userType } = req.body;

    // check user is valid input
    if ([name, email, mobileNo, password, userType].some((field) => field?.trim() === "") || !checkVaoidEmail(email)) {
        throw new ApiError(400, "Please provide valid inputs")
    }
    if (mobileNo.length !== 10) {
        throw new ApiError(400, "Please provide valid mobile number")
    }
    if (!validatePassword(password)) {
        throw new ApiError(400, "Password must be alphanumeric with a special character.")
    }

    // check user is exits
    const users = new User();
    const isUserExist = await users.isUserExist(email)
    if (isUserExist) {
        throw new ApiError(409, 'Another User already associated with this email.')
    }

    let userobj
    // check file upload
    if ((req.files && Array.isArray(req.files.picture) && req.files.picture.length > 0)) {
        let avatorImage = req.files.picture[0].path;
        const image = await new Image({ imageurl: avatorImage }).save();

        if (!image) throw new ApiError(400, "Avator image is not upload")
        userobj = {
            name,
            email,
            password,
            userType,
            mobileNo,
            picture: image._id
        }

    }
    else {
        userobj = {
            name,
            email,
            password,
            mobileNo,
            userType,
        }
    }

    // create user and save
    const user = new User(userobj)

    try {
        const createdUser = await user.save();
        // remove value from user object before sending response
        createdUser.password = undefined;
        createdUser.updatedAt = undefined;
        res.status(201).json(
            new ApiResponse(201, createdUser, "User registered Successfully")
        )

    } catch (error) {
        // Handle the error here while create user
        if (userobj.hasOwnProperty("image")) {
            await Image.findByIdAndDelete(userobj.image);
        }
        throw new ApiError(400, error);
    }

});

// @desc Login 
// @route POST /api/v1/login
// @access Public
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    // check user is valid input
    if ([email, password].some((field) => field?.trim() === "") || !checkVaoidEmail(email)) {
        throw new ApiError(400, "Please provide valid inputs")
    }

    // check user is exits
    const users = await User.aggregate([
        {
            $match: { email }
        },
    ])
    if (!users[0]) {
        throw new ApiError(400, 'No user is not associated with this email.')
    }
    // compare given password and hashed password
    const matchPassword = await isValidPassowrd(password, users[0].password);
    if (!matchPassword) {
        throw new ApiError(401, "Invalid credentials");
    }
    users[0].password = undefined;
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(users[0]._id);

    if (!accessToken && !refreshToken) {
        throw new ApiError(500, "Something went wrong in token generation.");
    }
    res.status(200)
        .cookie("accessToken", accessToken, OPTIONS)
        .cookie("refreshToken", refreshToken, OPTIONS)
        .send(new ApiResponse(200, { accessToken, refreshToken }, "User logged in successfully"))

});





// @desc logout
// @route POST /api/v1/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
    const { _id, token_id } = req.auth;
    // revoke the tokens
    const refreshTokenInstances = new RefreshToken();
    await refreshTokenInstances.deleteToken(token_id)
    res.status(200)
        .clearCookie("accessToken", OPTIONS)
        .clearCookie("refreshToken", OPTIONS)
        .send(new ApiResponse(200, {}, `Logged out from all devices Successfully.`))
})





//@desc Returning Block users
// @route POST /api/v1/admin/remove/users/:id
// @access Private
// @access Admin
const removeUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isBlock: true }, { new: true });
    if (!user) {
        throw new ApiError(400, "user not found")
    }
    res.status(200).send(
        new ApiResponse(200, user, "User has been block")
    )

})


module.exports = {
    register
    , login
    , logout
    , removeUser
    ,
};