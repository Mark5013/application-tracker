import { Request, Response, NextFunction } from "express";
import pool from "../queries";

// get count of all offers, inprogess, applied, and rejected applications for specific users
export const statusStats = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// extract uid from url
	const uid = req.params.uid;

	// if uid null, 403 status code
	if (uid == null) {
		res.status(403).json({ message: "Invalid uid" });
	} else {
		pool.query(
			"SELECT COUNT(appid), status FROM apps WHERE uid=$1 GROUP BY status;",
			[uid],
			(err, results) => {
				if (err) {
					res.sendStatus(500);
				} else {
					res.status(200).json({ message: results.rows });
				}
			}
		);
	}
};

// get the count of all offers, applied, inprogess, and rejected applications over time
export const statusOverTimeStats = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// extract uid from url
	const uid = req.params.uid;

	// max amount seen so far for each possible status
	const MAXES: { [key: string]: number } = {
		Offer: 0,
		Rejected: 0,
		Applied: 0,
		"In-Progress": 0,
	};

	// if uid null, 403 status
	if (uid == null) {
		res.status(403).json({ message: "Invalid uid" });
	} else {
		pool.query(
			`SELECT t1.date, t1.status, COUNT(DISTINCT t2.appid) AS num_appids
			FROM apps AS t1
			INNER JOIN apps AS t2
  			ON t1.status = t2.status
  			AND t1.uid = t2.uid
  			AND t1.date >= t2.date
			GROUP BY t1.date, t1.status, t1.uid
			HAVING t1.uid = $1
			ORDER BY t1.date, t1.status;`,
			[uid],
			(err, results) => {
				if (err) {
					res.sendStatus(500);
				} else {
					if (results.rowCount === 0) {
						res.status(200).json({ message: [] });
						return;
					}

					// loop through results
					for (const obj of results.rows) {
						// set the max seen for each possible status, this so graph on client side can connect null values
						MAXES[`${obj.status}`] = Math.max(
							MAXES[`${obj.status}`],
							obj.num_appids
						);
						// set key as whatever status, and pair as number of apps up until that date
						obj[`${obj.status}`] = obj.num_appids;

						// extract year, month, day, and then create new date object in the obj
						const [year, month, day] = obj.date.split("-");
						obj.date = new Date(year, month - 1, day);
					}

					// if any of the statuses are not on the earlist date, add them to it with number of apps = 0, this is so graph can connect null points
					if (!("Offer" in results.rows[0])) {
						results.rows[0]["Offer"] = 0;
					}
					if (!("In-Progress" in results.rows[0])) {
						results.rows[0]["In-Progress"] = 0;
					}
					if (!("Rejected" in results.rows[0])) {
						results.rows[0]["Rejected"] = 0;
					}
					if (!("Applied" in results.rows[0])) {
						results.rows[0]["Applied"] = 0;
					}

					// if any of the statueses are not on the latest date, add them to it with the max number of apps, this is so graph can connect null points
					if (!("Offer" in results.rows[results.rowCount - 1])) {
						results.rows[results.rowCount - 1]["Offer"] =
							MAXES["Offer"];
					}
					if (
						!("In-Progress" in results.rows[results.rowCount - 1])
					) {
						results.rows[results.rowCount - 1]["In-Progress"] =
							MAXES["In-Progress"];
					}
					if (!("Applied" in results.rows[results.rowCount - 1])) {
						results.rows[results.rowCount - 1]["Applied"] =
							MAXES["Applied"];
					}
					if (!("Rejected" in results.rows[results.rowCount - 1])) {
						results.rows[results.rowCount - 1]["Rejected"] =
							MAXES["Rejected"];
					}
					res.status(200).json({ message: results.rows });
				}
			}
		);
	}
};
