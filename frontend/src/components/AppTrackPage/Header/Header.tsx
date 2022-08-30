import styles from "./Header.module.css";
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
	const navigate = useNavigate();

	const handleLoginClick = () => {
		navigate("./login", { replace: false });
	};

	return (
		<div className={styles.header}>
			<h1 className={styles.title}>App Tracker</h1>
			<Button variant="contained" size="large" onClick={handleLoginClick}>
				Login
			</Button>
		</div>
	);
};

export default Header;
