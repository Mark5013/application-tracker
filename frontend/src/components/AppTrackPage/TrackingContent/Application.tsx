import styles from "./Application.module.css";
import React from "react";
import LongMenu from "../../Shared/LongMenu";

interface ApplicationProps {
	company: string;
	position: string;
	date: string;
	status: string;
	id: string;
	deleteApp: Function;
}

const Application: React.FC<ApplicationProps> = (props) => {
	return (
		<div className={styles.application}>
			<div className={styles.container}>
				<img
					className={styles.companyLogo}
					src={`https://logo.clearbit.com/${props.company.replace(
						/\s/g,
						""
					)}.com`}
					alt="company photo"
				/>
				<h3 className={styles.companyName}>{props.company}</h3>
			</div>
			<div className={styles.container}>
				<div>
					<p className={styles.positionName}>{props.position}</p>
					<p className={styles.dateApplied}>{props.date}</p>
				</div>
				<div className={styles.temp}>
					<LongMenu
						deleteApp={props.deleteApp}
						status={props.status}
						id={props.id}
					/>
				</div>
			</div>
		</div>
	);
};

export default Application;
