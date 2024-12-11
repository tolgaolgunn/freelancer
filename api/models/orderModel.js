import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sellerName:{
      type: String,
      required: false,
    },
    buyerName: {
      type: String,
      required: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String,
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
