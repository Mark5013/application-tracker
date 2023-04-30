import React, { useState, useContext } from "react";
import styles from "./LoginForm.module.css";
import Input from "../Shared/Input";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import useHttpReq from "../../hooks/use-HttpReq";
import UserContext from "../../store/userContext";

const LoginForm = (props: { switchForm: Function }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [accountNotFound, setAccountNotFound] = useState(false);

	const userCtx = useContext(UserContext);
	const sendRequest = useHttpReq();
	const navigate = useNavigate();

	const submitFormHandler = async (event: React.MouseEvent<Element>) => {
		event.preventDefault();
		// send data to server and validate credentials -> then log user in if valid
		// if no acc, set account not found to true
		try {
			const user = await sendRequest(
				"http://localhost:5000/auth/login",
				"POST",
				{ "Content-type": "application/json" },
				JSON.stringify({ email, password })
			);

			// save user to context and go to apps page
			if (user) {
				userCtx.login(
					user.message.id,
					user.message.email,
					user.message.firstName,
					user.message.lastName
				);
				navigate("/apps", { replace: true });
			} else {
				throw new Error("Couldn't login, please try again");
			}
		} catch (err) {
			setAccountNotFound(true);

			if (err instanceof Error) {
				setErrorMessage(err.message);
			}
		}
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
					<p className={styles.errorMsg}>{errorMessage}</p>
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
