import mongoose from "mongoose";
import slugify from "slugify";

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

// //////////////////////////////////////////////////////////////////////

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

// ///////////////////////////////////////////////////////////////////////

productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: 1 });
productSchema.index({ createdAt: 1 });

// //////////////////////////////////////////////////////////////////
const Product = mongoose.model("Product", productSchema);
export default Product;
// /////////////////////////////////////////////////////////////////
