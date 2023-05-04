import { NextFunction, Request, Response } from "express";
import pool from "../queries";

export const addApplication = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// extract params from body
	const { company, position, date, status, appid: id, uid } = req.body;
	console.log(company, position, date, status, id, uid);
	// if any are null 400 status
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
		// insert into apps table
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

export const editApplication = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// extract uid and appid from url
	const { appId, companyName, position, date, status, id } = req.body;

	if (
		!id ||
		!appId.trim() ||
		!companyName.trim() ||
		!position.trim() ||
		!date.trim() ||
		!status.trim()
	) {
		res.status(400).json({ message: "Invalid datate" });
	} else {
		pool.query(
			"UPDATE apps SET company=$1, position=$2, date=$3, status=$4 WHERE appid=$5 AND uid=$6 RETURNING *;",
			[companyName, position, date, status, appId, id],
			(err, results) => {
				if (err) {
					console.log(err);
					res.status(500).send({ message: "something went wrong" });
				} else if (results.rowCount == 0) {
					res.status(400).json({
						message: "No application match given credentials",
					});
				} else {
					console.log(results.rows[0]);
					res.status(200).json({ message: results.rows[0] });
				}
			}
		);
	}
};

// get all of a users applications
export const getApplications = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// extract uid from url
	const uid = req.params.uid;

	// if the uid is null, 400 status
	if (uid == null) {
		res.status(400).json({ message: "Invalid user" });
	} else {
		// retrieve all of users apps from database, ordered by their status
		pool.query(
			"SELECT * from apps WHERE uid=$1 ORDER BY status;",
			[uid],
			(err, results) => {
				if (err) {
					res.status(500).json({ message: "Something went wrong" });
				} else {
					res.status(200).json({ message: results.rows || [] });
				}
			}
		);
	}
};
