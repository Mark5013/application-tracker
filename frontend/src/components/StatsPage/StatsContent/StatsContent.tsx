import React, { useCallback, useEffect, useState, useContext } from "react";
import AppContext from "../../../store/appContext";
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
import useHttpReq from "../../../hooks/use-HttpReq";
import UserContext from "../../../store/userContext";
import MenuPopupState from "../../Shared/PopUpMenu";
import PiChart from "./GraphTypes/PiChart";
import LChart from "./GraphTypes/LineChart";

const StatsContent = () => {
	const appCtx = useContext(AppContext);
	const userCtx = useContext(UserContext);

	const [graphStyle, setGraphStyle] = useState("Bar");
	const [stats, setStats] = useState<any[]>([]);
	const sendReq = useHttpReq();

	const [activeIndex, setActiveIndex] = useState(0);
	const onPieEnter = useCallback(
		(_: any, index: number) => {
			setActiveIndex(index);
		},
		[setActiveIndex]
	);

	useEffect(() => {
		let data;
		const fetchStats = async () => {
			try {
				console.log("fetching...");
				data = await sendReq(
					`http://localhost:5000/stats/statusStats/${userCtx.user.id}`,
					"GET",
					{
						"Content-type": "application/json",
						Authorization: `Bearer ${userCtx.user.accessToken}`,
					}
				);

				console.log(data.message);
				if (data == undefined) {
					throw new Error();
				} else {
					setStats(data.message);
				}
			} catch (err) {
				console.log(err);
			}
		};

		fetchStats();
	}, []);

	const handleSaveClick = () => {
		domtoimage
			.toBlob(document.getElementById("node-to-convert")!)
			.then(function (blob) {
				fileDownload(blob, "dom-to-image.png");
			});
	};

	const renderBarChart = (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={stats}>
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
			<div className={styles.buttons}>
				<MenuPopupState
					title="Chart Type"
					items={["Bar", "Pie", "Line"]}
					clickFunc={setGraphStyle}
				/>
			</div>
			<div className={styles.content}>
				<div className={styles.graph} id="node-to-convert">
					{graphStyle == "Bar" && renderBarChart}
					{graphStyle == "Pie" && <PiChart />}
					{graphStyle == "Line" && <LChart />}
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
