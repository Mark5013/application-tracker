import React, { ChangeEventHandler } from "react";
import styles from "./Input.module.css";

interface InputProps {
	type: string;
	label: string;
	value: string;
	setValue: Function;
}

const Input: React.FC<InputProps> = (props) => {
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		props.setValue(event.target.value);
	};

	return (
		<div className={styles.container}>
			<label>{props.label}:</label>
			<br />
			<input
				className={styles.input}
				type={props.type}
				onChange={onChangeHandler}></input>
		</div>
	);
};

export default Input;
