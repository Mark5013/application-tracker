import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();

// verifty the JWT
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
	// extract auth header
	const authHeader = req.headers["authorization"];
	console.log(`authheader: ${authHeader}`);

	// if no auth header, sent back 401 status with invalid
	if (!authHeader) {
		res.status(401).json({ message: "Invalid" });
	} else {
		// else extract token from header
		const token = authHeader.split(" ")[1];
		// access jwt secret
		const sec: jwt.Secret = process.env.ACCESS_TOKEN_SECRET!;
		// verify token, if valid do nothing, else send a status of 403
		jwt.verify(token, sec, (err, token) => {
			if (err) {
				res.status(403).json({ message: "Invalid token" });
			} else {
				next();
			}
		});
	}
};

export default verifyJWT;
