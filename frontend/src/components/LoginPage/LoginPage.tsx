import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const LoginPage: React.FC = () => {
	const [loginMode, setLoginMode] = useState(true);

	const toggleFormMode = () => {
		setLoginMode((prev) => !prev);
	};

	return (
		<>
			{loginMode ? (
				<LoginForm switchForm={toggleFormMode} />
			) : (
				<SignUpForm switchForm={toggleFormMode} />
			)}
		</>
	);
};

export default LoginPage;
