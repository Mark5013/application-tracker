import { MouseEventHandler } from "react";
import styles from "./ErrorModal.module.css";
import { Button } from "@mui/material";
import React from "react";

type ErrorProps = {
	text: string;
	handleClick: MouseEventHandler<HTMLButtonElement>;
};

const ErrorModal = (props: ErrorProps) => {
	return (
		<div className={styles.modal}>
			<p>{props.text}</p>
			<Button
				variant="contained"
				size="large"
				onClick={props.handleClick}>
				Ok
			</Button>
		</div>
	);
};

export default ErrorModal;
