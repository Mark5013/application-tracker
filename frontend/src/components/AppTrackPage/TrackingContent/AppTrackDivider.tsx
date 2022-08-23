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
	title: string;
	apps: App[];
}

const AppTrackDivider: React.FC<AppTrackDividerProps> = (props) => {
	return (
		<div>
			<h2>{props.title}</h2>
			<div className={styles.divider}>
				{props.apps.map((app) => (
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
		</div>
	);
};

export default AppTrackDivider;
