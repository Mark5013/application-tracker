import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import Input from "../Shared/Input";
import { Button } from "@mui/material";

const LoginForm = (props: { switchForm: Function }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const submitFormHandler = (event: React.MouseEvent<Element>) => {
		event.preventDefault();
		// send data to server and validate credentials -> then log user in if valid
		console.log(email);
		console.log(password);
	};

	const switchMode = (event: React.MouseEvent<Element>) => {
		props.switchForm();
	};

	return (
		<div className={styles.container}>
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
				<div className={styles.btns}>
					<Button
						variant="contained"
						onClick={submitFormHandler}
						type="submit">
						Login
					</Button>
					<Button variant="outlined" onClick={switchMode}>
						Sign Up
					</Button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
