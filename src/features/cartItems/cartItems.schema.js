import mongoose, { Schema } from "mongoose";

export const cartItemsSchema = new Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }
})