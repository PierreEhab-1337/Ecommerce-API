
import mongoose from "mongoose";
const productSchema = new mongoose.Schema({

name:{
    type: String,
    required:true,
   maxlength:200

},
price: {
    type: Number,
    required: true,
    min: 0
},
slug:{
    type: String,
   
},
shortDescription :
{
type: String,
maxlength: 500,
required: true
},
description :
{
    type: String,
    required: true,
},
discountPrice:
{
    type: Number,
    min: 0, 
    required: false
},
stock:
{
    type: Number,
    required: true,
},
sku:
{
    type: String,
    required: false,
    unique: true
},
images: {
    type: [imageSchema],
    required: true
},
category:
{
    type:String,
    required: true,
    lowercase: true,
},
subcategory:
{
    type:String,
    required: false,
},
brand:
{
    type: String,
    required: false,
},
tags:
{
    type: [String],
    required: false,
},
reviews:
{
    type: [reviewSchema],
    required: false
},
averageRating:
{
    type: Number,

},
numReviews:
{
    type: Number,

},
featured:
{
    type: Boolean,
    default: false,
    required: false
},
isActive:
{
    type: Boolean,
    default: true,
    required: false
},
createdBy:
{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
},
{
     timestamps: true
}
);
productSchema.index({category: 1});
productSchema.index({brand:1});
productSchema.index({price:1});
productSchema.index({averageRating:1});
productSchema.index({createdAt:-1});


export default mongoose.model("Product", productSchema);