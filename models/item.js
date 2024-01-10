const mongoose = require("mongoose")

const Schema = mongoose.Schema

const itemSchema = new Schema({
    name: { type: String, minLength: 2, trim: true, required: true },
    description: { type: String, minLength: 3, trim: true, required: true },
    stock: { type: Number, min: 1, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
})

itemSchema.virtual("url").get(function () {
    return `/inventory/product/${this._id}`
})

module.exports = mongoose.model("Item", itemSchema)