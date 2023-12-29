const mongoose = require("mongoose")

const Schema = mongoose.Schema

const itemSchema = new Schema({
    name: { type: String, minLength: 2, trim: true, required: true },
    description: { type: String, minLength: 3, trim: true, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, min: 1, required: true }
})

itemSchema.virtual("url").get(() => {
    return `/book/${this._id}`
})