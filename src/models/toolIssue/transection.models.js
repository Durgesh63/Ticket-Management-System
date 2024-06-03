const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ApiError = require("../../utils/ApiError");

const TransectionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    toolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tool",
    },
    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })


TransectionSchema.plugin(aggregatePaginate);

TransectionSchema.methods.updateStatus = async function (_id) {
    try {
        return await Transection.findByIdAndUpdate(_id, {
            status: !this.status
        }, { new: true });
    } catch (error) {
        throw new ApiError(400, "No Tool is exist")
    }
}


const Transection = mongoose.model('IssueTool', TransectionSchema);



module.exports = {
    Transection
}
