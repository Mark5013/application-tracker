import React from "react";
import styles from "./Input.module.css";

interface InputProps {
	type: string;
	label: string;
}

const Input: React.FC<InputProps> = (props) => {
	return (
		<div className={styles.container}>
			<label>{props.label}:</label>
			<br />
			<input className={styles.input} type={props.type}></input>
		</div>
	);
};

export default Input;
