import styles from "./AppTrackDivider.module.css";
import Application from "./Application";
import React from "react";

interface App {
	company: string;
	position: string;
	date: string;
	status: string;
	appid: string;
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
	console.log(JSON.stringify(props));

	// if a filter is passed in, filter the apps
	if (props.filter.trim() !== "") {
		filteredApps = props.apps.filter((app) =>
			app.company.toLowerCase().startsWith(props.filter.toLowerCase())
		);
	}

	return (
		<>
			<div className={styles.divider}>
				{filteredApps.map((app) => (
					<Application
						key={app.appid}
						company={app.company}
						position={app.position}
						date={app.date}
						status={app.status}
						id={app.appid}
						deleteApp={props.deleteApp}
						editApp={props.editApp}
						toggleForm={props.toggleForm}
					/>
				))}
			</div>
			<p className={styles.numberOfApps}>{filteredApps.length} Apps</p>
		</>
	);
};

export default AppTrackDivider;
