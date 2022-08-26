import React, { SyntheticEvent, useEffect } from "react";
import styles from "./TrackingContent.module.css";
import AppTrackDivider from "./AppTrackDivider";
import Application from "./Application";
import { useState } from "react";
import { Grid, Icon, IconButton } from "@mui/material";

interface App {
	company: string;
	position: string;
	date: string;
}

const TrackingContent: React.FC = () => {
	// all applications
	const [appliedApps, setAppliedApps] = useState<App[]>([
		{ company: "Amazon", position: "SWE", date: "08/07/22" },
	]);
	const [inProgressApps, setInProgressApps] = useState<App[]>([]);
	const [offerApps, setOfferApps] = useState<App[]>([]);
	const [rejectedApps, setRejectedApps] = useState<App[]>([]);

	// filters for apps
	const [appliedFilter, setAppliedFilter] = useState("");
	const [inProgressFilter, setInProgressFilter] = useState("");
	const [offerFilter, setOfferFilter] = useState("");
	const [rejectedFilter, setRejectedFilter] = useState("");

	// handles changes for applied app filter input
	const handleAppliedFilter = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setAppliedFilter(event.currentTarget.value);
	};

	const handleInProgressFilter = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setInProgressFilter(event.currentTarget.value);
	};

	const handleOfferFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOfferFilter(event.currentTarget.value);
	};

	const handleRejectedFilter = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRejectedFilter(event.currentTarget.value);
	};

	return (
		<div className={styles.test}>
			<Grid container rowSpacing={4} columnSpacing={1}>
				<Grid
					item
					lg={3}
					md={4}
					sm={6}
					xs={12}
					className={styles.divider}>
					<h2 className={styles.title}>Applied</h2>
					<input
						className={styles.search}
						type="search"
						placeholder="Filter by company"
						value={appliedFilter}
						onChange={handleAppliedFilter}
					/>
					<AppTrackDivider
						apps={appliedApps}
						filter={appliedFilter}
					/>
				</Grid>
				<Grid
					item
					lg={3}
					md={4}
					sm={6}
					xs={12}
					className={styles.divider}>
					<h2 className={styles.title}>In-Progress</h2>
					<input
						className={styles.search}
						type="search"
						placeholder="Filter by company"
						value={inProgressFilter}
						onChange={handleInProgressFilter}
					/>
					<AppTrackDivider
						apps={inProgressApps}
						filter={inProgressFilter}
					/>
				</Grid>
				<Grid
					item
					lg={3}
					md={4}
					sm={6}
					xs={12}
					className={styles.divider}>
					<h2 className={styles.title}>Offer</h2>
					<input
						className={styles.search}
						type="search"
						placeholder="Filter by company"
						value={offerFilter}
						onChange={handleOfferFilter}
					/>
					<AppTrackDivider apps={offerApps} filter={offerFilter} />
				</Grid>
				<Grid
					item
					lg={3}
					md={4}
					sm={6}
					xs={12}
					className={styles.divider}>
					<h2 className={styles.title}>Rejected</h2>
					<input
						className={styles.search}
						type="search"
						placeholder="Filter by company"
						value={rejectedFilter}
						onChange={handleRejectedFilter}
					/>
					<AppTrackDivider
						apps={rejectedApps}
						filter={rejectedFilter}
					/>
				</Grid>
			</Grid>
			<IconButton className={styles.iconBtn} size="small">
				<Icon fontSize="large">add_circle</Icon>
			</IconButton>
		</div>
	);
};

export default TrackingContent;
