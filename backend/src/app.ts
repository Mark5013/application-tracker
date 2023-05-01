import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

import { appRoutes } from "../routes/appRoutes";
import { authRoutes } from "../routes/authRoutes";

const app = express();
app.use(express.json());
app.use(cors());

// auth routes, login/signup
app.use("/auth", authRoutes);

// app routes
app.use("/apps", appRoutes);

app.listen(process.env.PORT || 5000, () => {
	console.log("listening on port 5000");
});
