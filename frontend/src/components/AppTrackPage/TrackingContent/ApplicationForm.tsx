import React, { MouseEventHandler, useState } from "react";
import styles from "./ApplicationForm.module.css";
import Input from "../../Shared/Input";
import BasicSelect from "./BasicSelect";
import { IconButton, Icon } from "@mui/material";

interface ApplicationFormProps {
	toggleForm: MouseEventHandler;
}

const ApplicationForm: React.FC<ApplicationFormProps> = (props) => {
	const [companyName, setCompanyName] = useState("");
	const [position, setPosition] = useState("");
	const [dateApplied, setDateApplied] = useState("");
	const [status, setStatus] = useState("");

	const submitFormHandler = (event: React.MouseEvent<Element>) => {
		event.preventDefault();
		console.log(companyName);
		console.log(position);
		console.log(dateApplied);
		console.log(status);
	};

	return (
		<form className={styles.form}>
			<Input
				type="text"
				label="Company name"
				value={companyName}
				setValue={setCompanyName}
			/>
			<Input
				type="text"
				label="Position"
				value={position}
				setValue={setPosition}
			/>
			<Input
				type="date"
				label="Date applied"
				value={dateApplied}
				setValue={setDateApplied}
			/>
			<BasicSelect label="Status" val={status} setVal={setStatus} />
			<div className={styles.btns}>
				<IconButton onClick={props.toggleForm}>
					<Icon>close</Icon>
				</IconButton>
				<IconButton type="submit" onClick={submitFormHandler}>
					<Icon>done</Icon>
				</IconButton>
			</div>
		</form>
	);
};

export default ApplicationForm;
