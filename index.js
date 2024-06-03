require('dotenv').config()
const { app } = require('./src/app.js')
const { PORT } = require('./src/constant.js')
const { bdConnect } = require("./src/db/db.connection.js")
// app()

bdConnect()
    .then(() => {
        app.listen(PORT || 8080, () => {
            console.log(`Server is running at PORT: ${PORT}`);
        })
    }).catch((error) => {
        throw error
    })