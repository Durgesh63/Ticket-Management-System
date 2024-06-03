const { Router } = require('express');
const { login, logout, register } = require('../controller/user/user.controllers');
const checkAuthUser = require('../middleware/auth.middleware');
const Upload = require('../middleware/multer.middleware');

const publicrouter = Router()

publicrouter.route("/register").post(Upload.fields([{ name: "picture", maxCount: 1 }]), register)
publicrouter.route("/login").post(login)
publicrouter.route("/logout").post(checkAuthUser, logout)



module.exports = publicrouter