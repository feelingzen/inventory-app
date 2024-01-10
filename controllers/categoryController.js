const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const debug = require("debug")("item")
const Category = require("../models/category")
const Item = require("../models/item")

// Displays list of all items
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name description")
        .sort({ name: 1 })
        .exec()
    res.render("category_list", {
        title: "Category List",
        the_categories: allCategories
    })
})

// Views a specific category_detail item's page
exports.category_detail = asyncHandler(async (req, res, next) => {
    const [categoryInfo, categoryItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }).exec()
    ])
    res.render("category_detail", {
        title: categoryInfo.name,
        categoryInfo: categoryInfo,
        categoryItems: categoryItems
    })
})

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", { title: "Create Category" })
})

exports.category_create_post = [
    body("category_name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be more than 2 characters")
        .escape(),
    body("category_description")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Description must be more than 3 characters")
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const category = new Category({
            name: req.body.category_name,
            description: req.body.category_description
        })

        // If errors are present then rerender form with errors
        if (!errors.isEmpty()) {
            res.render("category_form", { 
                title: "Create Category",
                category: category,
                errors: errors.array()
            })
            return
        } else {
            await category.save()
            res.redirect(category.url)
        }
    })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [categoryInfo, categoryItems] = await Promise.all([
        Category.findById( req.params.id ),
        Item.find({ category: req.params.id })
    ])

    if (categoryInfo == null) {
        debug(`book not found ${req.params.id}`)
        res.redirect("/inventory/categories")
    } else {
        res.render("category_delete", {
            title: 'Delete Book',
            categoryInfo,
            categoryItems
        })
    }
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [categoryInfo, categoryItems] = await Promise.all([
        Category.findById( req.params.id ),
        Item.find({ category: req.params.id })
    ])

    if (categoryItems.length) {
        res.render("category_delete", {
            title: 'Delete Book',
            categoryInfo,
            categoryItems
        })
    } else {
        await Category.findByIdAndDelete(req.params.id)
        res.redirect("/inventory/categories")
    }
})