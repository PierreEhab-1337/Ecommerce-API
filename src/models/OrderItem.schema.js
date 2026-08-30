const mongoose = require('mongoose')
const orderItemSchema =new mongoose.Schema({
    product:{
        Type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      required: true,

    },
     name:{
      type: String,
      required: true,
    },
    image:{
      type: Image,
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
})

module.exports = orderItemSchema;
