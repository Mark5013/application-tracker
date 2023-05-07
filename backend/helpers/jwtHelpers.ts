import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();

// creates an access token based on data given to it
export const createAccessToken = (data: any) => {
	const sec: jwt.Secret = process.env.ACCESS_TOKEN_SECRET!;

	return jwt.sign(data, sec, { expiresIn: "168h" });
};

// creates a refresh token based on data given to it
export const createRefreshToken = (data: any) => {
	const sec: jwt.Secret = process.env.REFRESH_TOKEN_SECRET!;

	return jwt.sign(data, sec, { expiresIn: "300h" });
};
