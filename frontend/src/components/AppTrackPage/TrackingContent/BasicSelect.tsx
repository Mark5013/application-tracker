import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import styles from "./BasicSelect.module.css";

export default function BasicSelect(props: { label: string }) {
	const [status, setStatus] = React.useState("");

	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl className={styles.container}>
				<InputLabel id="demo-simple-select-label">
					{props.label}
				</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={status}
					label={props.label}
					onChange={handleChange}>
					<MenuItem value={"Applied"}>Applied</MenuItem>
					<MenuItem value={"In-Progress"}>In-Progress</MenuItem>
					<MenuItem value={"Offer"}>Offer</MenuItem>
					<MenuItem value={"Rejected"}>Rejected</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
}
