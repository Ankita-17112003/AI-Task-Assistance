const axios = require("axios");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

const createChat = async (req, res) => {
  try {
    const { prompt, chatId } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Please enter a question",
      });
    }

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2:3b",
      prompt: prompt,
      stream: false,
    });

    const answer = response.data.response;
    let savedChat;

    if (chatId) {
      // Add messages to the existing chat
      savedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: prompt },
                { role: "assistant", content: answer },
              ],
            },
          },
        },
        { new: true },
      );

      if (!savedChat) {
        return res.status(404).json({
          message: "Chat not found",
        });
      }
    } else {
      // Create a new chat
      savedChat = await Chat.create({
        prompt: prompt,
        response: answer,
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: answer },
        ],
      });
    }
    res.json({
      response: answer,
      chatId: savedChat._id,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({
      message: "AI response or chat saving failed",
    });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error("Fetching chats failed:", error.message);
    res.status(500).json({
      message: "Could not fetch chat history",
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid chat ID",
      });
    }

    const deletedChat = await Chat.findByIdAndDelete(id);

    if (!deletedChat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (err) {
    console.error("Delete chat error:", error.message);

    return res.status(500).json({
      message: "Failed to delete chat",
    });
  }
};

module.exports = {
  createChat,
  getChats,
  deleteChat,
};
