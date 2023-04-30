import { NextFunction, Request, Response } from "express";
import pool from "../queries";
import bcrypt from "bcrypt";

type User = {
	id: number;
	email: string;
	password: string;
	firstname: string;
	lastname: string;
};

function ValidateEmail(mail: string) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return true;
	}
	return false;
}

function ValidatePassword(password: string) {
	if (
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
			password
		)
	) {
		return true;
	}
	return false;
}

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

						// create user
						pool.query(
							"INSERT INTO users (email, password, firstName, lastName) VALUES ($1, $2, $3, $4) RETURNING *;",
							[email, hash, firstName, lastName],
							(err, results) => {
								// if err, throw err
								if (err) {
									throw new Error();
								}
								// on success return user
								const user: User = results.rows[0];

								res.status(201).json({
									message: {
										id: user.id,
										email: user.email,
										firstName: user.firstname,
										lastName: user.lastname,
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

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
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

					// if match, return user with succ, else return err
					if (match) {
						res.status(200).json({
							message: {
								id: user.id,
								email: user.email,
								firstName: user.firstname,
								lastName: user.lastname,
							},
						});
					} else {
						res.status(400).json({ message: "Invalid password" });
					}
				});
			}
		}
	);
};
