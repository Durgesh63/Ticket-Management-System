const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ApiError = require("../../utils/ApiError");

const ToolsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
    },
    toolsCategory: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true,
        default: 0
    },
    quantityCount: {
        type: Number,
    }


}, { timestamps: true })


ToolsSchema.plugin(aggregatePaginate);
ToolsSchema.pre("save", async function (next) {
    try {
        this.quantityCount = this.quantity
        next()
    } catch (error) {
        return next(error)
    }
})

ToolsSchema.methods.removeQuantity = async function () {
    if (this.quantityCount < 1) {
        throw new ApiError(400, "Sorry, No tools are Avalible.")
    }
    try {
        return await Tool.findByIdAndUpdate(this._id, {
            quantityCount: this.quantityCount - 1
        }, { new: true })
    } catch (error) {
        throw new ApiError(400, error)
    }
}

ToolsSchema.methods.addQuantity = async function () {
    try {
        if (this.quantity === this.quantityCount) {
            throw new ApiError(400, "Sorry, No tools are Avalible.")
        }
        return await Tool.findByIdAndUpdate(this._id, {
            quantityCount: this.quantityCount + 1
        }, { new: true });
    } catch (error) {
        throw new ApiError(400, error)
    }
}

const Tool = mongoose.model('Tool', ToolsSchema);

module.exports = {
    Tool
}
