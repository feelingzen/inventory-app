const mongoose = require("mongoose")

const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: { type: String, minLength: 2, trim: true, required: true },
    description: { type: String, minLength: 3, trim: true, required: true },
})

categorySchema.virtual("url").get(function () {
    return `/inventory/category/${this._id}`
})

module.exports = mongoose.model("Category", categorySchema)