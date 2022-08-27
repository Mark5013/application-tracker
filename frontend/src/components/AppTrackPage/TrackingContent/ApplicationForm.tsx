import React from "react";
import styles from "./ApplicationForm.module.css";
import Input from "../../Shared/Input";
import BasicSelect from "./BasicSelect";

const ApplicationForm: React.FC = () => {
	return (
		<form className={styles.form}>
			<Input type="text" label="Company name" />
			<Input type="text" label="Position" />
			<Input type="date" label="Date applied" />
			<BasicSelect label="Status" />
		</form>
	);
};

export default ApplicationForm;
