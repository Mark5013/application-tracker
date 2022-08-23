import styles from "./Application.module.css";
import React from "react";

interface ApplicationProps {
	company: string;
	position: string;
	date: string;
	imageUrl: string;
}

const Application: React.FC<ApplicationProps> = (props) => {
	return (
		<div className={styles.application}>
			<div className={styles.logoAndName}>
				<img
					className={styles.companyLogo}
					src={props.imageUrl}
					alt="company photo"
				/>
				<h3 className={styles.companyName}>{props.company}</h3>
			</div>
			<p className={styles.positionName}>{props.position}</p>
			<p className={styles.dateApplied}>{props.date}</p>
		</div>
	);
};

export default Application;
