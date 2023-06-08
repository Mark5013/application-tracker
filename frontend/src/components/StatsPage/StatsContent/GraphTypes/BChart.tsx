import ErrorModal from "../../../Shared/ErrorModal";
import BackDrop from "../../../Shared/BackDrop";
import { MouseEventHandler } from "react";
import ReactDOM from "react-dom";
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
import React from "react";
import { useState, useContext, useEffect } from "react";
import UserContext from "../../../../store/userContext";
import useHttpReq from "../../../../hooks/use-HttpReq";
import AppContext from "../../../../store/appContext";

const portal = document.getElementById("backdrop")! as HTMLDivElement;

const BChart = () => {
	const [isError, setIsError] = useState(false);

	const userCtx = useContext(UserContext);
	const appCtx = useContext(AppContext);
	const [stats, setStats] = useState<any[]>([]);
	const sendReq = useHttpReq();

	useEffect(() => {
		let data;
		const fetchStats = async () => {
			try {
				data = await sendReq(
					`http://localhost:5000/stats/statusStats/${userCtx.user.id}/${appCtx.season}`,
					"GET",
					{
						"Content-type": "application/json",
						Authorization: `Bearer ${userCtx.user.accessToken}`,
					}
				);

				if (data === undefined) {
					throw new Error();
				} else {
					setStats(data.message);
				}
			} catch (err) {
				setIsError(true);
			}
		};

		fetchStats();
	}, []);

	const handleErrorClick: MouseEventHandler<
		HTMLButtonElement | HTMLDivElement
	> = () => {
		setIsError((prev) => !prev);
	};

	return isError ? (
		<>
			{ReactDOM.createPortal(
				<>
					<ErrorModal
						text="Something went wrong!"
						handleClick={handleErrorClick}
					/>
					<BackDrop toggleForm={handleErrorClick}></BackDrop>
				</>,
				portal
			)}
		</>
	) : (
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
};

export default BChart;
