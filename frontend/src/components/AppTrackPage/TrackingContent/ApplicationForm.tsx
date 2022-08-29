import React, { MouseEventHandler, useState } from "react";
import styles from "./ApplicationForm.module.css";
import Input from "../../Shared/Input";
import BasicSelect from "./BasicSelect";
import { IconButton, Icon } from "@mui/material";

interface ApplicationFormProps {
	toggleForm: any;
	addApplication?: Function;
	editApplication?: Function;
	appId?: string;
	companyName: string;
	position: string;
	dateApplied: string;
	status: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = (props) => {
	// values for inputs
	const [companyName, setCompanyName] = useState(props.companyName);
	const [position, setPosition] = useState(props.position);
	const [dateApplied, setDateApplied] = useState(props.dateApplied);
	const [status, setStatus] = useState(props.status);

	// error status' for inputs
	const [companyNameError, setCompanyNameError] = useState(false);
	const [positionError, setPositionError] = useState(false);
	const [dateAppliedError, setDateAppliedError] = useState(false);
	const [statusError, setStatusError] = useState(false);

	// handles submitting form for editing and adding
	const submitFormHandler = (event: React.MouseEvent<Element>) => {
		let validForm = true;
		event.preventDefault();
		// get rid of white spaces on all inputs and check they aren't empty
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

		// check form is valid
		if (validForm) {
			// add application is prop exists
			if (props.addApplication) {
				props.addApplication(
					companyName,
					position,
					dateApplied,
					status
				);
			}

			// edit application if props exist
			if (props.editApplication && props.appId) {
				props.editApplication(
					props.appId,
					companyName,
					position,
					dateApplied,
					status
				);
				props.toggleForm();
			}
		}
	};

	return (
		<form className={styles.form}>
			<Input
				type="text"
				label="Company name"
				val={companyName}
				setValue={setCompanyName}
			/>
			{companyNameError && <p>Company name can't be empty</p>}
			<Input
				type="text"
				label="Position"
				val={position}
				setValue={setPosition}
			/>
			{positionError && <p>Position can't be empty</p>}
			<Input
				type="date"
				label="Date applied"
				val={dateApplied}
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
