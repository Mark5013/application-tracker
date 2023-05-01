import { NextFunction, Request, Response } from "express";
import pool from "../queries";

export const addApplication = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { company, position, date, status, id, uid } = req.body;

	if (
		!company.trim() ||
		!position.trim() ||
		!date.trim() ||
		!status.trim() ||
		!id.trim() ||
		uid == null
	) {
		res.status(400).json({ message: "Unable to add applications" });
	} else {
		pool.query(
			"INSERT INTO apps VALUES ($1, $2, $3, $4, $5, $6);",
			[id, uid, company, position, date, status],
			(err, results) => {
				if (err) {
					res.status(500).json({ message: "Something went wrong" });
				} else {
					res.status(201).json({ message: "Data added" });
				}
			}
		);
	}
};

export const getApplications = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log(req.params.uid);

	const uid = req.params.uid;

	if (uid == null) {
		res.status(400).json({ message: "Invalid user" });
	} else {
		pool.query(
			"SELECT * from apps WHERE uid=$1 ORDER BY status;",
			[uid],
			(err, results) => {
				if (err) {
					res.status(500).json({ message: "Something went wrong" });
				} else {
					console.log(results.rows);
					res.status(200).json({ message: results.rows || [] });
				}
			}
		);
	}
};
