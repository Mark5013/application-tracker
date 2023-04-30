import styles from "./Header.module.css";
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../../store/userContext";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const userCtx = useContext(UserContext);

	const handleLogoutClick = () => {
		console.log(userCtx);
		userCtx.logout();
		navigate("/", { replace: false });
	};

	return (
		<div className={styles.header}>
			<h1 className={styles.title}>App Tracker</h1>
			<Button
				variant="contained"
				size="large"
				onClick={handleLogoutClick}>
				Logout
			</Button>
		</div>
	);
};

export default Header;
