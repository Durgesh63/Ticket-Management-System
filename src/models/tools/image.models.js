const mongoose = require('mongoose');
const cloudinaryUpload = require('../../utils/Cloudinary');
const ApiError = require('../../utils/ApiError');

const imageSchema = new mongoose.Schema({
    imageurl: {
        type: String,
        required: [true, 'Image is required'],
    },
}, { timestamps: true });


imageSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("imageurl")) return next()
        const upload = await cloudinaryUpload(this.imageurl)
        this.imageurl = upload.url;
        next()
    } catch (error) {
        return next(error)
    }
})

imageSchema.methods.UpdateImage = async function (parmeter, value) {
    try {
        const upload = await cloudinaryUpload(value)
        if (!upload) throw new ApiError(400, "Something went wrong in image upload.")
        const image = await this.constructor.findOneAndUpdate({ _id: parmeter }, { $set: { imageurl: upload.url } }, { new: true })
        if (!image) {
            throw new Error("Image not found.");
        }
        return image
    } catch (error) {
        throw new ApiError(400, error);
    }
}

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;