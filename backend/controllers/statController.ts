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
