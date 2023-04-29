import express from "express";
import { signUpUser, loginUser } from "../controllers/authControllers";

const router = express.Router();

// log the user in
router.post("/login", loginUser);

// sign up the user
router.post("/signUp", signUpUser);

export { router as authRoutes };
