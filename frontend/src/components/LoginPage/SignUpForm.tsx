import React, { useState } from "react";
import styles from "./SignUpForm.module.css";
import { Button } from "@mui/material";
import Input from "../Shared/Input";

function ValidateEmail(mail: string) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return true;
	}
	return false;
}

function ValidatePassword(password: string) {
	if (
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
			password
		)
	) {
		return true;
	}
	return false;
}

const SignUpForm = (props: { switchForm: Function }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [firstError, setFirstError] = useState(false);
	const [lastError, setLastError] = useState(false);

	const submitFormHandler = (event: React.MouseEvent<Element>) => {
		event.preventDefault();
		let hasError = false;

		if (!ValidateEmail(email)) {
			setEmailError(true);
			hasError = true;
		} else {
			setEmailError(false);
		}

		if (firstName.trim().length === 0) {
			setFirstError(true);
			hasError = true;
		} else {
			setFirstError(false);
		}

		if (lastName.trim().length === 0) {
			setLastError(true);
			hasError = true;
		} else {
			setLastError(false);
		}

		if (!ValidatePassword(password)) {
			setPasswordError(true);
			hasError = true;
		} else {
			setPasswordError(false);
		}

		// send data to server to create acc and redirect user on success
		if (!hasError) {
			console.log(firstName);
			console.log(lastName);
			console.log(email);
			console.log(password);
		}
	};

	const switchMode = (event: React.MouseEvent<Element>) => {
		props.switchForm();
	};

	return (
		<div className={styles.container}>
			<form className={styles.form}>
				<Input
					type="text"
					label="First name"
					val={firstName}
					setValue={setFirstName}
				/>
				{firstError && <p>First name must not be empty</p>}
				<Input
					type="text"
					label="Last name"
					val={lastName}
					setValue={setLastName}
				/>
				{lastError && <p>Last name must not be empty</p>}
				<Input
					type="text"
					label="Email"
					val={email}
					setValue={setEmail}
				/>
				{emailError && <p>Please enter valid email</p>}
				<Input
					type="password"
					label="Password"
					val={password}
					setValue={setPassword}
				/>
				{passwordError && (
					<p>
						Password must be at least 8 characters, contains 1
						numeric, 1 lowercase, 1 uppercase letter, and 1 special
						character
					</p>
				)}
				<div className={styles.btns}>
					<Button
						variant="contained"
						onClick={submitFormHandler}
						type="submit">
						Sign Up
					</Button>
					<Button variant="outlined" onClick={switchMode}>
						Login
					</Button>
				</div>
			</form>
		</div>
	);
};

export default SignUpForm;
