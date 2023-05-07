import { NextFunction, Request, Response } from "express";
import { ValidateEmail, ValidatePassword } from "../helpers/validationHelpers";
import pool from "../queries";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { createAccessToken, createRefreshToken } from "../helpers/jwtHelpers";
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
				res.status(500).json({ message: "Something went wrong" });
			}
			if (results.rowCount > 0) {
				res.status(400).json({ message: "User already exists" });
			} else {
				// salt password
				bcrypt.genSalt(10, (err, salt) => {
					// if err throw err
					if (err) {
						res.status(500).json({
							message: "Something went wrong",
						});
						return;
					}

					// hash password
					bcrypt.hash(password, salt, (err, hash) => {
						// if err, throw err
						if (err) {
							res.status(500).json({
								message: "Something went wrong",
							});
							return;
						}

						// create their refresh token
						const refreshToken = createRefreshToken({
							UserInfo: { email, firstName, lastName },
						});

						// create user
						pool.query(
							"INSERT INTO users (email, password, firstName, lastName, refreshToken) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
							[email, hash, firstName, lastName, refreshToken],
							(err, results) => {
								// if err, throw err
								if (err) {
									res.status(500).json({
										message: "Something went wrong",
									});
								}
								// on success return user with created jwt
								const user: User = results.rows[0];

								// create access token
								const accessToken = createAccessToken({
									UserInfo: {
										id: user.id,
										email: email,
										firstName: user.firstname,
										lastName: user.lastname,
									},
								});

								// store refresh token as httpOnly cookie for 30 days
								res.cookie("jwt", refreshToken, {
									secure: true,
									httpOnly: true,
									sameSite: "none",
									maxAge: 24 * 60 * 60 * 1000 * 30,
								});

								// send back created user
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

	// validate credentials
	if (!ValidateEmail(email) || !ValidatePassword(password)) {
		res.status(400).json({ message: "Invalid credentials" });
		return;
	}

	// query database for matching emai
	pool.query(
		"SELECT * FROM users WHERE email=$1;",
		[email],
		(error, results) => {
			if (error) {
				res.status(500).json({ message: "Something went wrong" });
			}

			// if no matching email, return err
			if (results.rowCount == 0) {
				res.status(400).json({ message: "Incorrect credentials" });
			} else {
				const user: User = results.rows[0];

				// compare passwords
				bcrypt.compare(password, user.password, (err, match) => {
					if (err) {
						res.status(500).json({
							message: "Something went wrong",
						});
						return;
					}

					// if match, return user with acessToken, else return err
					if (match) {
						// create new accessToken
						const accessToken = createAccessToken({
							UserInfo: {
								id: user.id,
								email: email,
								firstName: user.firstname,
								lastName: user.lastname,
							},
						});

						// create new refreshToken
						const refreshToken = createRefreshToken({
							UserInfo: {
								email: email,
								firstName: user.firstname,
								lastName: user.lastname,
							},
						});

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
									res.status(500).json({
										message: "Something went wrong",
									});
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
						res.status(400).json({
							message: "Invalid credentials",
						});
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

		// query database for matching refresh token and clear it if matched or not
		pool.query(
			"SELECT * FROM users WHERE refreshtoken=$1;",
			[refreshToken],
			(err, results) => {
				if (err) {
					res.sendStatus(500);
				} else if (results.rowCount == 0) {
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
