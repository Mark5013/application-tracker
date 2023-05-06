import { Request, Response, NextFunction } from "express";
import pool from "../queries";

export const statusStats = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const uid = req.params.uid;
	console.log(`uid: ${uid}`);

	if (uid == null) {
		res.status(403).json({ message: "Invalid uid" });
	} else {
		pool.query(
			"SELECT COUNT(appid), status FROM apps WHERE uid=$1 GROUP BY status;",
			[uid],
			(err, results) => {
				if (err) {
					console.log(err);
				} else {
					console.log(results.rows);
					res.status(200).json({ message: results.rows });
				}
			}
		);
	}
};

export const statusOverTimeStats = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const uid = req.params.uid;
	console.log(`uid: ${uid}`);

	const MAXES: { [key: string]: number } = {
		Offer: 0,
		Rejected: 0,
		Applied: 0,
		"In-Progress": 0,
	};

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
					console.log(err);
				} else {
					for (const obj of results.rows) {
						MAXES[`${obj.status}`] = Math.max(
							MAXES[`${obj.status}`],
							obj.num_appids
						);
						obj[`${obj.status}`] = obj.num_appids;
						const [year, month, day] = obj.date.split("-");
						obj.date = new Date(year, month, day);
					}
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
