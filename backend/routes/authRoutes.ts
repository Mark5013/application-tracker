import express from "express";
import {
	signUpUser,
	loginUser,
	logoutUser,
} from "../controllers/authControllers";
import handleRefreshToken from "../controllers/refreshTokenController";

const router = express.Router();

// log the user in
router.post("/login", loginUser);

// sign up the user
router.post("/signUp", signUpUser);

// logout route
router.get("/logout", logoutUser);

// use refresh token to get new access token
router.get("/refresh", handleRefreshToken);

export { router as authRoutes };
