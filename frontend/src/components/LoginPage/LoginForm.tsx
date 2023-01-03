import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import Input from "../Shared/Input";
import { Button } from "@mui/material";

const LoginForm = (props: { switchForm: Function }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [accountNotFound, setAccountNotFound] = useState(false);

	const submitFormHandler = (event: React.MouseEvent<Element>) => {
		event.preventDefault();
		// send data to server and validate credentials -> then log user in if valid
		// if no acc, set account not found to true
		console.log(email);
		console.log(password);
	};

	const switchMode = (event: React.MouseEvent<Element>) => {
		props.switchForm();
	};

	return (
		<div className={styles.container}>
			<a className={styles.title} href="/">
				App Tracker
			</a>
			<form className={styles.form}>
				<Input
					type="text"
					label="Email"
					val={email}
					setValue={setEmail}
				/>
				<Input
					type="password"
					label="Password"
					val={password}
					setValue={setPassword}
				/>
				{accountNotFound && (
					<p className={styles.errorMsg}>
						Email and password don't match, please try again
					</p>
				)}
				<div className={styles.btns}>
					<Button
						color="inherit"
						variant="contained"
						onClick={submitFormHandler}
						type="submit">
						Login
					</Button>
					<p className={styles.switchModeText}>
						Don't have an account?
					</p>
					<Button
						variant="outlined"
						onClick={switchMode}
						color="info">
						Sign Up
					</Button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
