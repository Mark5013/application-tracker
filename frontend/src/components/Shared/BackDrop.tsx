import React from "react";
import styles from "./BackDrop.module.css";
import { PropsWithChildren } from "react";

interface BackDropProps {
	toggleForm: React.MouseEventHandler<HTMLDivElement>;
}

const BackDrop: React.FC<BackDropProps> = (props) => {
	return <div className={styles.backdrop} onClick={props.toggleForm}></div>;
};

export default BackDrop;
