const asyncHandler = require('express-async-handler')
const Category = require("../models/category")
const Item = require("../models/item")

exports.index = asyncHandler(async (req, res, next) => {
    const [itemCount, categoryCount] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ])
    res.render("index", {
        title: "DaClothez",
        itemCount,
        categoryCount
    })
})