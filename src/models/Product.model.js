import mongoose from "mongoose";
import slugify from "slugify";
import imageSchema from "./subdocuments/image.subdocument.js";
import reviewSchema from "./subdocuments/review.subdocument.js";

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
  },
  stock:
  {
      type: Number,
      required: true,
  },
  sku:
  {
      type: String,
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
  },
  brand:
  {
      type: String,
  },
  tags:
  {
      type: [String],
  },
  reviews:
  {
      type: [reviewSchema],
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
  },
  isActive:
  {
      type: Boolean,
      default: true,
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

productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

productSchema.pre("validate", async function () {
  const Product = this;
  if (Product.isModified("name")) {
    Product.slug = slugify(Product.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true
    });
  }
});

productSchema.methods.calcAverageRating = function () {
  if (this.reviews.length == 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    this.numReviews = this.reviews.length;
    this.averageRating = totalRating / this.numReviews;
  }
};


const Product = mongoose.model("Product", productSchema);
export default Product;
