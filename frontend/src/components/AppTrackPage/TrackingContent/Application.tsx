import styles from "./Application.module.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import LongMenu from "../../Shared/LongMenu";
import ApplicationForm from "./ApplicationForm";
import BackDrop from "../../Shared/BackDrop";

const portal = document.getElementById("backdrop")! as HTMLDivElement;

interface ApplicationProps {
	company: string;
	position: string;
	date: string;
	status: string;
	id: string;
	deleteApp: Function;
	toggleForm: React.MouseEventHandler<Element>;
	editApp: Function;
}

const Application: React.FC<ApplicationProps> = (props) => {
	const [showEditForm, setShowEditForm] = useState(false);
	const toggleEditForm = () => {
		setShowEditForm((prev) => !prev);
	};

	return (
		<>
			{showEditForm &&
				ReactDOM.createPortal(
					<>
						<ApplicationForm
							companyName={props.company}
							position={props.position}
							dateApplied={props.date}
							status={props.status}
							toggleForm={toggleEditForm}
							editApplication={props.editApp}
							appId={props.id}
						/>
						<BackDrop toggleForm={toggleEditForm}></BackDrop>{" "}
					</>,
					portal
				)}
			<div className={styles.application}>
				<div className={styles.container}>
					<div className={styles.companyLogo}>
						<img
							src={`https://logo.clearbit.com/${props.company.replace(
								/\s/g,
								""
							)}.com`}
							alt="company photo"
						/>
					</div>

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
							editApp={toggleEditForm}
							status={props.status}
							id={props.id}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Application;
