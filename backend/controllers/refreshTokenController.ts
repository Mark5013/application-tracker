import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pool from "../queries";
dotenv.config();

// uses refresh token to create new access token
const handleRefreshToken = (req: Request, res: Response) => {
	// extract cookies
	const cookies = req.cookies;

	// if cookie doesn't exit, 401 status
	if (!cookies?.jwt) {
		res.sendStatus(401);
	} else {
		// extract refreshtoken from cookies
		const refreshToken = cookies.jwt;

		// query database for user with matching refreshtoken
		pool.query(
			"SELECT * FROM users WHERE refreshtoken=$1;",
			[refreshToken],
			(err, results) => {
				// if doesn't exist, 403 status, invalid cookie
				if (results.rowCount == 0) {
					res.sendStatus(403);
				} else {
					// extract refresh token secret
					const sec: jwt.Secret = process.env.REFRESH_TOKEN_SECRET!;
					// verify the refresh token
					jwt.verify(refreshToken, sec, (err: any, token: any) => {
						// if emails match create accessToken and send it back, else 403 status
						if (
							err ||
							results.rows[0].email != token.UserInfo.email
						) {
							res.sendStatus(403);
						} else {
							const sec2: jwt.Secret =
								process.env.ACCESS_TOKEN_SECRET!;
							const accessToken = jwt.sign(
								{
									UserInfo: {
										id: results.rows[0].id,
										email: results.rows[0].email,
										firstName: results.rows[0].firstName,
										lastName: results.rows[0].lastName,
									},
								},
								sec2,
								{ expiresIn: "336h" }
							);

							res.status(200).json({
								message: accessToken,
								id: results.rows[0].id,
								email: results.rows[0].email,
								firstName: results.rows[0].firstname,
								lastName: results.rows[0].lastname,
							});
						}
					});
				}
			}
		);
	}
};

export default handleRefreshToken;
