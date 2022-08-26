import styles from "./AppTrackDivider.module.css";
import Application from "./Application";
import { v4 as uuidv4 } from "uuid";
import React from "react";

interface App {
	company: string;
	position: string;
	date: string;
}

interface AppTrackDividerProps {
	filter: string;
	apps: App[];
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
					key={uuidv4()}
					company={app.company}
					position={app.position}
					date={app.date}
					imageUrl={
						"https://images-na.ssl-images-amazon.com/images/G/01/gc/designs/livepreview/amazon_a_black_noto_email_v2016_us-main._CB624175556_.png"
					}
				/>
			))}
		</div>
	);
};

export default AppTrackDivider;
