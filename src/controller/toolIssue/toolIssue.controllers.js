

//@desc Create tools
//@Route POST /api/v1/user/transection

const { Transection } = require("../../models/toolIssue/transection.models");
const { Tool } = require("../../models/tools/tools.models");
const ApiError = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
var mongoose = require('mongoose');


//@access Private
const AddTicket = asyncHandler(async (req, res) => {
    const { toolID } = req.body;
    const { _id } = req.auth;
    if (!toolID && !_id) {
        throw new ApiError(400, "Please provide valid inputs");
    }
    const toolItem = await Tool.findById(toolID);

    // check tool id are exist or not
    if (!toolItem) {
        throw new ApiError(400, "Please provide valid inputs");
    }

    await toolItem.removeQuantity()

    const TransectionInstance = new Transection({
        userId: _id,
        toolId: toolID
    });
    try {
        const toolIssue = await TransectionInstance.save()
        return res.status(201).json(
            new ApiResponse(201, toolIssue, "Tool Issue")
        )
    } catch (error) {

        throw new ApiError(400, error);
    }

})



//@access Private
const RemoveTicket = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new ApiError(400, "Please provide valid inputs");
    }
    const toolInstance = new Transection();
    const toolTransection = await toolInstance.updateStatus(id);
    if (!toolTransection) {
        throw new ApiError(400, "Tool not found")
    }
    const toolItem = await Tool.findById(toolTransection.toolId);
    if (!toolItem) {
        throw new ApiError(400, "No tool found");
    }
    const tools = await toolItem.addQuantity()
    res.status(200).send(
        new ApiResponse(200, tools, "Tool has been Tools Return")
    )
})


const ToolIssueList = asyncHandler(async (req, res) => {
    const { _id } = req.auth;
    const toolTransection = await Transection.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(_id), status: true }
        },
        {
            '$lookup': {
                'from': 'tools',
                'localField': 'toolId',
                'foreignField': '_id',
                'as': 'tools'
            }
        }, {
            '$unwind': {
                'path': '$tools'
            }
        }, {
            '$lookup': {
                'from': 'images',
                'localField': 'tools.image',
                'foreignField': '_id',
                'as': 'tools.images'
            }
        }, {
            '$unwind': {
                'path': '$tools.images',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                'toolId': 1,
                'transectionId': '$_id',
                'tools.title': 1,
                'tools.toolsCategory': 1,
                'tools.images.imageurl': 1,
                'userId': 1
            }
        }, {
            '$group': {
                '_id': '$toolId',
                'userId': {
                    '$first': '$userId'
                },
                'tools': {
                    '$first': '$tools'
                },
                'transectionId': {
                    '$push': '$transectionId'
                },
                'available': {
                    '$sum': 1
                }
            }
        },
    ]);

    res.status(200).send(
        new ApiResponse(200, toolTransection, "Tool has been Tools Return")
    )
})


module.exports = { AddTicket, RemoveTicket, ToolIssueList }