import mongoose from 'mongoose'
const orderItemSchema =new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      required: true,

    },
     name:{
      type: String,
      required: true,
    },
    image:{
      type: String,
      required: true,
    },
    price:{
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    },
    {
        _id :false
    }
)

export default orderItemSchema;
