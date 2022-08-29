import styles from "./AppTrackDivider.module.css";
import Application from "./Application";
import React from "react";

interface App {
	company: string;
	position: string;
	date: string;
	status: string;
	id: string;
}

interface AppTrackDividerProps {
	filter: string;
	apps: App[];
	deleteApp: Function;
	editApp: Function;
	toggleForm: React.MouseEventHandler<Element>;
}

const AppTrackDivider: React.FC<AppTrackDividerProps> = (props) => {
	// extract apps from props
	let filteredApps = props.apps;

	// if a filter is passed in, filter the apps
	if (props.filter.trim() !== "") {
		filteredApps = props.apps.filter((app) =>
			app.company.toLowerCase().startsWith(props.filter.toLowerCase())
		);
	}

	return (
		<div className={styles.divider}>
			{filteredApps.map((app) => (
				<Application
					key={app.id}
					company={app.company}
					position={app.position}
					date={app.date}
					status={app.status}
					id={app.id}
					deleteApp={props.deleteApp}
					editApp={props.editApp}
					toggleForm={props.toggleForm}
				/>
			))}
		</div>
	);
};

export default AppTrackDivider;
