import React from "react";
import styles from "./Input.module.css";

interface InputProps {
	type: string;
	label: string;
	val: string;
	setValue: Function;
}

const Input: React.FC<InputProps> = (props) => {
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		props.setValue(event.target.value);
	};

	return (
		<div className={styles.container}>
			<label htmlFor={props.label}>{props.label}:</label>
			<br />
			<input
				className={styles.input}
				type={props.type}
				onChange={onChangeHandler}
				value={props.val}
				name={props.label}></input>
		</div>
	);
};

export default Input;
