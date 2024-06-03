const Image = require("../../models/tools/image.models");
const { Tool } = require("../../models/tools/tools.models");
const ApiError = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

//@desc Create tools
//@Route POST /api/v1/user/add/tools
//@access Private
const addTools = asyncHandler(async (req, res) => {
    const { title, toolsCategory, quantity } = req.body;
    if ([title, toolsCategory, quantity].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please provide valid inputs");
    }
    let product
    if ((req.files && Array.isArray(req.files.picture) && req.files.picture.length > 0)) {
        let toolImage = req.files.picture[0].path;
        const image = await new Image({ imageurl: toolImage }).save();
        if (!image) throw new ApiError(400, "Avator image is not upload")
        product = {
            title,
            quantity,
            toolsCategory,
            image: image._id
        }

    } else {
        product = {
            title,
            quantity,
            toolsCategory,
        }
    }

    const toolInstance = new Tool(product);
    try {
        const product = await toolInstance.save()
        return res.status(201).json(
            new ApiResponse(201, product, "Tools create Successfully")
        )
    } catch (error) {
        if (product.hasOwnProperty("image")) {
            await Image.findByIdAndDelete(product.image);
        }
        throw new ApiError(400, error);
    }

})



//@desc all tool list 
//@Route Get /api/v1/user/all/tool
//@access Private
const allProductList = asyncHandler(async (req, res) => {
    let { limit, page } = await req.query;
    const toolsInstance = Tool.aggregate([
        {
            $match: {}
        },
        {

            $lookup: {
                from: 'images',
                localField: 'image',
                foreignField: '_id',
                as: 'image'
            }

        },
        {
            $project: {
                title: 1,
                quantity: 1,
                toolsCategory: 1,
                quantityCount: 1,
                image: { $arrayElemAt: ["$image.imageurl", 0] },
                createdAt: 1,
                updatedAt: 1,
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        },
    ]);
    let options = {
        page: page,
        limit: limit,
        pagination: (page && limit && page > 0 && limit > 0) ? true : false
    };
    const tools = await Tool.aggregatePaginate(toolsInstance, options)
    return res.status(200).send(
        new ApiResponse(200, tools, 'All tools retrieved successfully')
    )
})


module.exports = {
    addTools
    , allProductList

};