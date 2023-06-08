import React, { useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { useContext, useEffect } from "react";
import useHttpReq from "../../../../hooks/use-HttpReq";
import UserContext from "../../../../store/userContext";
import { ResponsiveContainer } from "recharts";
import ErrorModal from "../../../Shared/ErrorModal";
import BackDrop from "../../../Shared/BackDrop";
import { MouseEventHandler } from "react";
import ReactDOM from "react-dom";
import AppContext from "../../../../store/appContext";

const portal = document.getElementById("backdrop")! as HTMLDivElement;

export default function LChart(props: any) {
	const userCtx = useContext(UserContext);
	const appCtx = useContext(AppContext);
	const [data, setData] = useState([]);
	const [isError, setIsError] = useState(false);
	const sendReq = useHttpReq();

	useEffect(() => {
		let res: any;
		// get data from backend
		const getData = async () => {
			try {
				res = await sendReq(
					`http://localhost:5000/stats/statusOverTime/${userCtx.user.id}/${appCtx.season}`,
					"GET",
					{
						"Content-type": "application/json",
						Authorization: `Bearer ${userCtx.user.accessToken}`,
					}
				);
				setData(res.message);
			} catch (err) {
				setIsError(true);
			}
		};
		getData();
	}, []);

	const dateFormatter = (date: string) => {
		const newDate = new Date(date);
		return newDate.toLocaleDateString();
	};

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
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" tickFormatter={dateFormatter} />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					connectNulls
					type="monotone"
					dataKey="Rejected"
					stroke="Red"
					activeDot={{ r: 8 }}
				/>
				<Line
					connectNulls
					type="monotone"
					dataKey="Offer"
					stroke="Green"
				/>
				<Line
					connectNulls
					type="monotone"
					dataKey="In-Progress"
					stroke="Blue"
				/>
				<Line
					connectNulls
					type="monotone"
					dataKey="Applied"
					stroke="Yellow"
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
