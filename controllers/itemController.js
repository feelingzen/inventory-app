const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const debug = require("debug")("item")
const Category = require("../models/category")
const Item = require("../models/item")

// Displays list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({})
    .sort({ name: 1 })
    .exec()
    res.render("item_list", {
        title: "Product List",
        the_items: allItems
    })
})

// Views a specific item's page
exports.item_detail = asyncHandler(async (req, res, next) => {
    const itemInfo = await Item.findById( req.params.id )
        .populate("category")
        .exec()
    res.render("item_detail", {
        title: itemInfo.name,
        categoryInfo: itemInfo.category,
        itemInfo: itemInfo
    })
})

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}).exec()
    res.render("item_form", { 
        title: "Create Product",
        categories: categories
    })
})

exports.item_create_post = [
    body("product_name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Your product name must be 2 or more characters long.")
        .escape(),
    body("product_description")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Your product description must be 3 or more characters long")
        .escape(),
    body("product_stock")
        .trim()
        .isInt({ min: 1})
        .withMessage("Stock must be 1 or more")
        .isNumeric()
        .withMessage("Please provide a number for the Stock option")
        .escape(),
        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req)
            const category_list = await Category.find({})
            const item = new Item ({
                name: req.body.product_name,
                description: req.body.product_description,
                stock: req.body.product_stock,
                category: req.body.product_category
            })

            if (!errors.isEmpty()) {
                res.render("item_form", {
                    title: "Create Product",
                    product: item,
                    categories: category_list,
                    errors: errors.array()
                })
            } else {
                await item.save()
                res.redirect(item.url)
            }
        })
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const itemInfo = await Item.findById(req.params.id)

    res.render("item_delete", {
        title: "Delete Product",
        itemInfo
    })
})

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndDelete(req.params.id)
    res.redirect("/inventory/products")
})

exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [categories, itemInfo] = await Promise.all([
        Category.find({}).exec(),
        Item.findById(req.params.id)
    ])
    res.render("item_form", { 
        title: "Create Product",
        categories: categories,
        product: itemInfo
    })
})

exports.item_update_post = [
    body("product_name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Your product name must be 2 or more characters long.")
        .escape(),
    body("product_description")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Your product description must be 3 or more characters long")
        .escape(),
    body("product_stock")
        .trim()
        .isInt({ min: 1})
        .withMessage("Stock must be 1 or more")
        .isNumeric()
        .withMessage("Please provide a number for the Stock option")
        .escape(),
        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req)
            const category_list = await Category.find({})
            const item = new Item ({
                name: req.body.product_name,
                description: req.body.product_description,
                stock: req.body.product_stock,
                category: req.body.product_category,
                _id: req.params.id
            })

            if (!errors.isEmpty()) {
                res.render("item_form", {
                    title: "Create Product",
                    product: item,
                    categories: category_list,
                    errors: errors.array()
                })
            } else {
                const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {})
                res.redirect(updatedItem.url)
            }
        })
]