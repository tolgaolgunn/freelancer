import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  senderName:{
    type: String,
    required: false,
  },
  receivedName:{
    type: String,
    required: false,
  }
},{
  timestamps:true
});

export default mongoose.model("Message", MessageSchema)