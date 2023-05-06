import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import verifyJWT from "../helpers/verifyJWT";
import { appRoutes } from "../routes/appRoutes";
import { authRoutes } from "../routes/authRoutes";
import { statRoutes } from "../routes/statRoutes";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// set up cors
const corsConfig = {
	credentials: true,
	origin: true,
	allowedHeaders: ["Content-type", "Authorization"],
};
app.use(cors(corsConfig));

// auth routes, login/signup
app.use("/auth", authRoutes);

// app routes
app.use("/apps", verifyJWT, appRoutes);

// stats routes
app.use("/stats", verifyJWT, statRoutes);

app.listen(process.env.PORT || 5000, () => {
	console.log("listening on port 5000");
});
