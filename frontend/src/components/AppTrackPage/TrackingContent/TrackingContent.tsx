import React from "react";
import styles from "./TrackingContent.module.css";
import AppTrackDivider from "./AppTrackDivider";
import Application from "./Application";
import { useState } from "react";

interface App {
	company: string;
	position: string;
	date: string;
}

const TrackingContent: React.FC = () => {
	const [appliedApps, setAppliedApps] = useState<App[]>([
		{ company: "Amazon", position: "SWE", date: "08/07/22" },
	]);
	const [inProgressApps, setInProgressApps] = useState<App[]>([]);
	const [offerApps, setOfferApps] = useState<App[]>([]);
	const [rejectedApps, setRejectedApps] = useState<App[]>([]);

	return (
		<div className={styles.content}>
			<AppTrackDivider title="Applied" apps={appliedApps} />
			<AppTrackDivider title="In-Progress" apps={inProgressApps} />
			<AppTrackDivider title="Offer" apps={offerApps} />
			<AppTrackDivider title="Rejected" apps={rejectedApps} />
		</div>
	);
};

export default TrackingContent;
