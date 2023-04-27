import express from "express";

import { authRoutes } from "../routes/authRoutes";

const app = express();

// auth routes, login/signup
app.use("/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
	console.log("listening on port 5000");
});