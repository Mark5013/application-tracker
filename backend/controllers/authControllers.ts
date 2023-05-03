import { NextFunction, Request, Response } from "express";
import { ValidateEmail, ValidatePassword } from "../helpers/validationHelpers";
import pool from "../queries";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

type User = {
	id: number;
	email: string;
	password: string;
	firstname: string;
	lastname: string;
};

// create new user
export const signUpUser = (req: Request, res: Response, next: NextFunction) => {
	// extract user information
	const { email, password, firstName, lastName } = req.body;

	// validate credentials
	if (
		!ValidateEmail(email) ||
		!ValidatePassword(password) ||
		firstName.trim().length == 0 ||
		lastName.trim().length == 0
	) {
		res.status(400).json({ message: "Invalid credentials" });
		return;
	}

	// make sure user doesn't exist already
	pool.query(
		"SELECT * FROM users WHERE email=$1;",
		[email],
		(err, results) => {
			if (err) {
				console.log(err);
			}
			if (results.rowCount > 0) {
				res.status(400).json({ message: "User already exists" });
			} else {
				// salt password
				bcrypt.genSalt(10, (err, salt) => {
					// if err throw err
					if (err) {
						throw new Error();
					}

					// hash password
					bcrypt.hash(password, salt, (err, hash) => {
						// if err, throw err
						if (err) {
							throw new Error();
						}

						// get the refresh token secret
						const sec2: jwt.Secret =
							process.env.REFRESH_TOKEN_SECRET!;
						// create their refresh token
						const refreshToken = jwt.sign(
							{
								UserInfo: {
									email,
									firstName,
									lastName,
								},
							},
							sec2,
							{ expiresIn: "1000h" }
						);

						// create user
						pool.query(
							"INSERT INTO users (email, password, firstName, lastName, refreshToken) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
							[email, hash, firstName, lastName, refreshToken],
							(err, results) => {
								// if err, throw err
								if (err) {
									console.log(err);
									throw new Error();
								}
								// on success return user with created jwt
								const user: User = results.rows[0];
								// get access token secret
								const sec: jwt.Secret =
									process.env.ACCESS_TOKEN_SECRET!;
								// create access token
								const accessToken = jwt.sign(
									{
										UserInfo: {
											id: user.id,
											email: email,
											firstName: user.firstname,
											lastName: user.lastname,
										},
									},
									sec,
									{ expiresIn: "336h" }
								);

								// store refresh token as httpOnly cookie for 30 days
								res.cookie("jwt", refreshToken, {
									secure: true,
									httpOnly: true,
									sameSite: "none",
									maxAge: 24 * 60 * 60 * 1000 * 30,
								});

								// snd back created user
								res.status(201).json({
									message: {
										id: user.id,
										email: user.email,
										firstName: user.firstname,
										lastName: user.lastname,
										accessToken,
									},
								});
							}
						);
					});
				});
			}
		}
	);
};

// log user in
export const loginUser = (req: Request, res: Response, next: NextFunction) => {
	// extract email and password from body
	const { email, password } = req.body;

	// query database for matching emai
	pool.query(
		"SELECT * FROM users WHERE email=$1;",
		[email],
		(error, results) => {
			if (error) {
				throw error;
			}

			// if no matching email, return err
			if (results.rowCount == 0) {
				res.status(400).json({ message: "Incorrect email" });
			} else {
				const user: User = results.rows[0];

				// compare passwords
				bcrypt.compare(password, user.password, (err, match) => {
					if (err) {
						throw err;
					}

					// if match, return user with acessToken, else return err
					if (match) {
						const sec: jwt.Secret =
							process.env.ACCESS_TOKEN_SECRET!;
						const sec2: jwt.Secret =
							process.env.REFRESH_TOKEN_SECRET!;

						// create new accessToken
						const accessToken = jwt.sign(
							{
								UserInfo: {
									id: user.id,
									email: email,
									firstName: user.firstname,
									lastName: user.lastname,
								},
							},
							sec,
							{ expiresIn: "336h" }
						);

						// create new refreshToken
						const refreshToken = jwt.sign(
							{
								UserInfo: {
									email: email,
									firstName: user.firstname,
									lastName: user.lastname,
								},
							},
							sec2,
							{ expiresIn: "1000h" }
						);

						// store refreshToken as httpOnly cookie for 30 days
						res.cookie("jwt", refreshToken, {
							secure: true,
							httpOnly: true,
							sameSite: "none",
							maxAge: 24 * 60 * 60 * 1000 * 30,
						});

						// update users refreshtoken in database
						pool.query(
							"UPDATE users SET refreshtoken=$1 WHERE id=$2;",
							[refreshToken, user.id],
							(err, results2) => {
								if (err) {
									console.log(err);
								} else {
									// return the logged in user
									res.status(200).json({
										message: {
											id: user.id,
											email: user.email,
											firstName: user.firstname,
											lastName: user.lastname,
											accessToken,
										},
									});
								}
							}
						);
					} else {
						res.status(400).json({ message: "Invalid password" });
					}
				});
			}
		}
	);
};

// logout user
export const logoutUser = (req: Request, res: Response) => {
	// extract cookie
	const cookies = req.cookies;
	// if cookie doesn't exist, just send 401 status
	if (!cookies?.jwt) {
		res.sendStatus(401);
	} else {
		// extract refresh token from cookie
		const refreshToken = cookies.jwt;
		console.log(`logout: ${refreshToken}`);
		// query database for matching refresh token and clear it if matched or not
		pool.query(
			"SELECT * FROM users WHERE refreshtoken=$1;",
			[refreshToken],
			(err, results) => {
				if (results.rowCount == 0) {
					res.clearCookie("jwt", {
						secure: true,
						httpOnly: true,
						sameSite: "none",
						maxAge: 24 * 60 * 60 * 1000 * 30,
					});
					res.sendStatus(204);
				} else {
					pool.query(
						"UPDATE users SET refreshtoken=null WHERE refreshtoken=$1;",
						[refreshToken],
						(err, results2) => {
							if (err) {
								console.log(err);
								res.sendStatus(500);
							} else {
								res.clearCookie("jwt", {
									secure: true,
									httpOnly: true,
									sameSite: "none",
									maxAge: 24 * 60 * 60 * 1000 * 30,
								});
								res.sendStatus(204);
							}
						}
					);
				}
			}
		);
	}
};
