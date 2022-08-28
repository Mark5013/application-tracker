import React, { MouseEventHandler, useState } from "react";
import styles from "./ApplicationForm.module.css";
import Input from "../../Shared/Input";
import BasicSelect from "./BasicSelect";
import { IconButton, Icon } from "@mui/material";

interface ApplicationFormProps {
	toggleForm: MouseEventHandler;
	addApplication: Function;
}

const ApplicationForm: React.FC<ApplicationFormProps> = (props) => {
	const [companyName, setCompanyName] = useState("");
	const [position, setPosition] = useState("");
	const [dateApplied, setDateApplied] = useState("");
	const [status, setStatus] = useState("");

	const [companyNameError, setCompanyNameError] = useState(false);
	const [positionError, setPositionError] = useState(false);
	const [dateAppliedError, setDateAppliedError] = useState(false);
	const [statusError, setStatusError] = useState(false);

	const submitFormHandler = (event: React.MouseEvent<Element>) => {
		let validForm = true;
		event.preventDefault();
		if (companyName.trim().length === 0) {
			setCompanyNameError(true);
			validForm = false;
		} else {
			setCompanyNameError(false);
		}

		if (position.trim().length === 0) {
			setPositionError(true);
			validForm = false;
		} else {
			setPositionError(false);
		}

		if (dateApplied.trim().length === 0) {
			setDateAppliedError(true);
			validForm = false;
		} else {
			setDateAppliedError(false);
		}

		if (status.trim().length === 0) {
			setStatusError(true);
			validForm = false;
		} else {
			setStatusError(false);
		}

		if (validForm) {
			props.addApplication(companyName, position, dateApplied, status);
		}
	};

	return (
		<form className={styles.form}>
			<Input
				type="text"
				label="Company name"
				value={companyName}
				setValue={setCompanyName}
			/>
			{companyNameError && <p>Company name can't be empty</p>}
			<Input
				type="text"
				label="Position"
				value={position}
				setValue={setPosition}
			/>
			{positionError && <p>Position can't be empty</p>}
			<Input
				type="date"
				label="Date applied"
				value={dateApplied}
				setValue={setDateApplied}
			/>
			{dateAppliedError && <p>Date applied can't be empty</p>}
			<BasicSelect label="Status" val={status} setVal={setStatus} />
			{statusError && <p>Status can't be empty</p>}
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
