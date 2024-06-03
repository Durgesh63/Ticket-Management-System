const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express()


app.use(cors())

/**
 * Requset body  parsing middleware should be above any other middleware that needs to access the request body.
 */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // support encoded bodies

/**
 * Serve static  files from the `public` folder.
 * https://expressjs.com/en/starter/static-files.html
 */
app.use(express.static("public"));

/**
 * cookie parser
 */
app.use(cookieParser())


/**
 * Routes Import
 */
const userrouter = require('./Routes/user.routes');
const publicrouter = require('./Routes/public.routes');

/**
 * Routes definations in the application
 */
app.use("/api/v1/users", userrouter)
app.use("/api/v1", publicrouter)


app.use("*", (req, res) => {
    res.status(404).end({
        message: "404 Not Found!"
    })
})

module.exports = { app }