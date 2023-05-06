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

export default function LChart(props: any) {
	const userCtx = useContext(UserContext);
	const [data, setData] = useState([]);
	const sendReq = useHttpReq();

	useEffect(() => {
		let res: any;
		const getData = async () => {
			console.log("getting data...");
			try {
				res = await sendReq(
					`http://localhost:5000/stats/statusOverTime/${userCtx.user.id}`,
					"GET",
					{
						"Content-type": "application/json",
						Authorization: `Bearer ${userCtx.user.accessToken}`,
					}
				);

				setData(res.message);
			} catch (err) {
				console.log(err);
			} finally {
				console.log(JSON.stringify(res));
			}
		};
		getData();
	}, []);

	const dateFormatter = (date: string) => {
		// return moment(date).unix();
		const newDate = new Date(date);
		console.log(newDate);
		return newDate.toLocaleDateString();
	};

	return (
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
