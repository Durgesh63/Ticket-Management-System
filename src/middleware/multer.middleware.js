const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E1)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname.slice(-7))
    }
})

const Upload = multer({ storage: storage })

module.exports = Upload