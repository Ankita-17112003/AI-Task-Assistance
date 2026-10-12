const express = require("express");
const router = express.Router();
const { createChat ,getChats,deleteChat} = require("../controllers/chatControllers");


router.post("/chat", createChat);

router.get("/chats", getChats);

router.delete("/chats/:id",deleteChat)

module.exports = router;