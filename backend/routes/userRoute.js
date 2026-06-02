import express from "express";
import { getCurrentChatters, getUserbySearch } from "../Controllers/userHandlerController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.get('/search',isLogin,getUserbySearch);
router.get('/currentchatters',isLogin,getCurrentChatters);

export default router;