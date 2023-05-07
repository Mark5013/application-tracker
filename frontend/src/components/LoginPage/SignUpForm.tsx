import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUpForm.module.css";
import { Button } from "@mui/material";
import Input from "../Shared/Input";
import useHttpReq from "../../hooks/use-HttpReq";
import UserContext from "../../store/userContext";
import ErrorModal from "../Shared/ErrorModal";
import BackDrop from "../Shared/BackDrop";
import { MouseEventHandler } from "react";
import ReactDOM from "react-dom";

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

const portal = document.getElementById("backdrop")! as HTMLDivElement;

const SignUpForm = (props: { switchForm: Function }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [firstError, setFirstError] = useState(false);
	const [lastError, setLastError] = useState(false);

	const [emailExists, setEmailExists] = useState(false);
	const [isError, setIsError] = useState(false);

	const sendRequest = useHttpReq();
	const navigate = useNavigate();
	const userCtx = useContext(UserContext);

	const submitFormHandler = async (event: React.MouseEvent<Element>) => {
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
			try {
				const user = await sendRequest(
					"http://localhost:5000/auth/signUp",
					"POST",
					{ "Content-type": "application/json" },
					JSON.stringify({ email, password, firstName, lastName }),
					"include"
				);

				const accessToken = user?.message?.accessToken;

				// save user to ctx
				userCtx.login(
					user.message.id,
					user.message.email,
					user.message.firstName,
					user.message.lastName,
					accessToken
				);
				// navigate to home page
				navigate("/apps", { replace: true });
			} catch (err) {
				// show err message if user already exists
				if (
					err instanceof Error &&
					err.message === "User already exists"
				) {
					setEmailExists(true);
				} else {
					setIsError((prev) => !prev);
				}
			}
		}
	};

	const switchMode = (event: React.MouseEvent<Element>) => {
		props.switchForm();
	};

	const handleErrorClick: MouseEventHandler<
		HTMLButtonElement | HTMLDivElement
	> = () => {
		setIsError((prev) => !prev);
	};

	return (
		<>
			{isError &&
				ReactDOM.createPortal(
					<>
						<ErrorModal
							text="Something went wrong!"
							handleClick={handleErrorClick}
						/>
						<BackDrop toggleForm={handleErrorClick}></BackDrop>
					</>,
					portal
				)}
			<div className={styles.container}>
				<a className={styles.title} href="/">
					App Tracker
				</a>
				<form className={styles.form}>
					<Input
						type="text"
						label="First name"
						val={firstName}
						setValue={setFirstName}
					/>
					{firstError && (
						<p className={styles.errorMsg}>
							First name must not be empty
						</p>
					)}
					<Input
						type="text"
						label="Last name"
						val={lastName}
						setValue={setLastName}
					/>
					{lastError && (
						<p className={styles.errorMsg}>
							Last name must not be empty
						</p>
					)}
					<Input
						type="text"
						label="Email"
						val={email}
						setValue={setEmail}
					/>
					{emailError && (
						<p className={styles.errorMsg}>
							Please enter valid email
						</p>
					)}
					{emailExists && (
						<p className={styles.errorMsg}>Email already exists</p>
					)}
					<Input
						type="password"
						label="Password"
						val={password}
						setValue={setPassword}
					/>
					{passwordError && (
						<p className={styles.errorMsg}>
							Password must be at least 8 characters, contains 1
							numeric, 1 lowercase, 1 uppercase letter, and 1
							special character
						</p>
					)}
					<div className={styles.btns}>
						<Button
							color="inherit"
							variant="contained"
							onClick={submitFormHandler}
							type="submit">
							Sign Up
						</Button>
						<p className={styles.switchModeText}>
							Already have an account?
						</p>
						<Button
							variant="outlined"
							onClick={switchMode}
							color="info">
							Login
						</Button>
					</div>
				</form>
			</div>
		</>
	);
};

export default SignUpForm;
