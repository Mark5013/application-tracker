import { NextFunction, Request, Response } from "express";

export const signUpUser = (req: Request, res: Response, next: NextFunction) => {
	console.log(req.body);
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
	console.log(req.body);
};
