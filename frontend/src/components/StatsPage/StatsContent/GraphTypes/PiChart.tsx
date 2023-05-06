import React, { useContext, useCallback, useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import AppContext from "../../../../store/appContext";

export default function PiChart() {
	const data = [
		{ status: "Applied", count: 400 },
		{ status: "In-Progress", count: 300 },
		{ status: "Offer", count: 300 },
		{ status: "Rejected", count: 200 },
	];
	const appCtx = useContext(AppContext);
	useEffect(() => appCtx.fetchApps, []);
	data[0].count = appCtx.appliedApps.length;
	data[1].count = appCtx.inProgressApps.length;
	data[2].count = appCtx.offerApps.length;
	data[3].count = appCtx.rejectedApps.length;

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	const RADIAN = Math.PI / 180;
	const renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		index,
		payload,
		fill,
		value,
	}: any) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);
		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const sx = cx + (outerRadius + 10) * cos;
		const sy = cy + (outerRadius + 10) * sin;
		const mx = cx + (outerRadius + 30) * cos;
		const my = cy + (outerRadius + 30) * sin;
		const ex = mx + (cos >= 0 ? 1 : -1) * 22;
		const ey = my;
		const textAnchor = cos >= 0 ? "start" : "end";

		return (
			<g>
				<text
					x={x}
					y={y}
					fill="white"
					textAnchor={x > cx ? "start" : "end"}
					dominantBaseline="central">
					{`${payload.status}`}
				</text>
				<path
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill="none"
				/>
				<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fill="#999">{`${value}`}</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fill="#999">
					{`(${payload.status} ${(percent * 100).toFixed(2)}%)`}
				</text>
			</g>
		);
	};

	return (
		<PieChart width={1000} height={1000}>
			<Pie
				data={data}
				cx="425"
				cy="225"
				labelLine={false}
				label={renderCustomizedLabel}
				outerRadius={180}
				fill="#8884d8"
				dataKey="count">
				{data.map((entry, index) => (
					<Cell
						key={`cell-${index}`}
						fill={COLORS[index % COLORS.length]}
					/>
				))}
			</Pie>
		</PieChart>
	);
}
