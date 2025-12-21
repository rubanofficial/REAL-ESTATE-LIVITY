import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const router = express.Router();

// SIGNUP
router.post("/signup", signup);

// SIGNIN
router.post("/signin", signin);

export default router;
