import { NextFunction, Request, Response } from "express";
import pool from "../queries";

export const signUpUser = (req: Request, res: Response, next: NextFunction) => {
	pool.query("SELECT * FROM users;", (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
	console.log(req.body);
};
