import styles from "./Header.module.css";
import React from "react";
import { Button } from "@mui/material";

const Header: React.FC = () => {
	return (
		<div className={styles.header}>
			<h1 className={styles.title}>App Tracker</h1>
			<Button variant="contained" size="large">
				Login
			</Button>
		</div>
	);
};

export default Header;
