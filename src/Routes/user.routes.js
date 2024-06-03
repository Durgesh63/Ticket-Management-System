const { Router } = require('express');

const checkAuthUser = require('../middleware/auth.middleware');
const { addTools, allProductList } = require('../controller/tools/tools.controllers');
const Upload = require('../middleware/multer.middleware');
const { AddTicket, RemoveTicket, ToolIssueList } = require('../controller/toolIssue/toolIssue.controllers');

const userrouter = Router()

userrouter.use(checkAuthUser)

// tools ----
userrouter.route("/add/tools").post(Upload.fields([{ name: "picture", maxCount: 1 }]), addTools)
userrouter.route("/tools/list").get(allProductList)


userrouter.route("/tools/Issue").post(AddTicket)
userrouter.route("/tools/return-tool").post(RemoveTicket)

userrouter.route("/tools/Issue/list").get(ToolIssueList)





module.exports = userrouter