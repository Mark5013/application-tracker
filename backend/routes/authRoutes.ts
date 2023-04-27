import express from "express";

const router = express.Router();

// log the user in
router.post("/login", () => {
	console.log("logging in");
});

// sign up the user
router.post("/signUp", () => {
	console.log("signing up");
});

export { router as authRoutes };
