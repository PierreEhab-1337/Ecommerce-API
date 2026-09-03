import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },

    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
    },
  },
{
    _id:false
})

 export default shippingAddressSchema;