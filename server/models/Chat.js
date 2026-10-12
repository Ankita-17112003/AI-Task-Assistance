const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    
    messages: [
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);