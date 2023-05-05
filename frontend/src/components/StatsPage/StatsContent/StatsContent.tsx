import React, { useEffect, useState } from "react";
import AppContext from "../../../store/appContext";
import { useContext } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";
import styles from "./StatsContent.module.css";
import domtoimage from "dom-to-image";
import fileDownload from "js-file-download";
import { Button } from "@mui/material";

class App {
	company: string;
	position: string;
	date: string;
	status: string;
	appid: string;
	uid: number;
	constructor(
		company: string,
		position: string,
		date: string,
		status: string,
		appid: string,
		uid: number
	) {
		this.company = company;
		this.position = position;
		this.date = date;
		this.status = status;
		this.appid = appid;
		this.uid = uid;
	}
}

const StatsContent = () => {
	const appCtx = useContext(AppContext);

	const { appliedApps, inProgressApps, offerApps, rejectedApps, fetchApps } =
		appCtx;

	const [totalApps, setTotalApps] = useState<App[]>([]);

	useEffect(() => {
		try {
			fetchApps();
		} catch (err) {
		} finally {
			setTotalApps(
				appliedApps
					.concat(inProgressApps)
					.concat(offerApps)
					.concat(rejectedApps)
			);
		}
	}, [
		appliedApps.length,
		inProgressApps.length,
		offerApps.length,
		rejectedApps.length,
	]);

	const statusData = [
		{
			status: "Applied",
			count: totalApps.reduce(
				(acc, e) => (e.status == "Offer" ? acc + 1 : acc),
				0
			),
		},
		{
			status: "In-Progress",
			count: totalApps.reduce(
				(acc, e) => (e.status == "In-Progress" ? acc + 1 : acc),
				0
			),
		},
		{
			status: "Offer",
			count: totalApps.reduce(
				(acc, e) => (e.status == "Offer" ? acc + 1 : acc),
				0
			),
		},
		{
			status: "Rejected",
			count: totalApps.reduce(
				(acc, e) => (e.status == "Rejected" ? acc + 1 : acc),
				0
			),
		},
	];

	const handleSaveClick = () => {
		domtoimage
			.toBlob(document.getElementById("node-to-convert")!)
			.then(function (blob) {
				fileDownload(blob, "dom-to-image.png");
			});
	};

	const renderBarChart = (
		<ResponsiveContainer width="90%" height="60%">
			<BarChart data={statusData}>
				<XAxis dataKey="status" stroke="#8884d8" />
				<YAxis />
				<Tooltip
					wrapperStyle={{ width: 100, backgroundColor: "#ccc" }}
				/>
				<Legend
					width={100}
					wrapperStyle={{
						top: 40,
						right: 20,
						backgroundColor: "#f5f5f5",
						border: "1px solid #d5d5d5",
						borderRadius: 3,
						lineHeight: "40px",
					}}
				/>
				<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
				<Bar dataKey="count" fill="#8884d8" barSize={30} />
			</BarChart>
		</ResponsiveContainer>
	);

	return (
		<>
			<div className={styles.content}>
				<div className={styles.graph} id="node-to-convert">
					{renderBarChart}
				</div>
			</div>
			<div className={styles.buttons}>
				<Button
					variant="contained"
					size="small"
					onClick={handleSaveClick}>
					Download
				</Button>
			</div>
		</>
	);
};

export default StatsContent;
