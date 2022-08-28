import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./TrackingContent.module.css";
import AppTrackDivider from "./AppTrackDivider";
import Application from "./Application";
import BackDrop from "../../Shared/BackDrop";
import ApplicationForm from "./ApplicationForm";
import { useState } from "react";
import { Grid, Icon, IconButton } from "@mui/material";

class App {
	company: string;
	position: string;
	date: string;
	status: string;
	constructor(
		company: string,
		position: string,
		date: string,
		status: string
	) {
		this.company = company;
		this.position = position;
		this.date = date;
		this.status = status;
	}
}

const portal = document.getElementById("backdrop")! as HTMLDivElement;

const TrackingContent: React.FC = () => {
	// all applications
	const [appliedApps, setAppliedApps] = useState<App[]>([]);
	const [inProgressApps, setInProgressApps] = useState<App[]>([]);
	const [offerApps, setOfferApps] = useState<App[]>([]);
	const [rejectedApps, setRejectedApps] = useState<App[]>([]);

	// filters for apps
	const [appliedFilter, setAppliedFilter] = useState("");
	const [inProgressFilter, setInProgressFilter] = useState("");
	const [offerFilter, setOfferFilter] = useState("");
	const [rejectedFilter, setRejectedFilter] = useState("");

	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		console.log("fetch apps?");
		setAppliedApps(JSON.parse(localStorage.getItem("Applied") || "[]"));
		setInProgressApps(
			JSON.parse(localStorage.getItem("In-Progress") || "[]")
		);
		setOfferApps(JSON.parse(localStorage.getItem("Offer") || "[]"));
		setRejectedApps(JSON.parse(localStorage.getItem("Rejected") || "[]"));
	}, []);

	const toggleForm = () => {
		setShowForm((prev) => !prev);
	};

	const addApplication = (
		companyName: string,
		position: string,
		date: string,
		status: string
	) => {
		//create app
		const newApp = new App(companyName, position, date, status);
		let curApps;
		switch (status) {
			case "Applied":
				curApps = appliedApps;
				curApps.push(newApp);
				localStorage.setItem(`${status}`, JSON.stringify(curApps));
				setAppliedApps(curApps);
				break;
			case "In-Progress":
				curApps = inProgressApps;
				curApps.push(newApp);
				localStorage.setItem(`${status}`, JSON.stringify(curApps));
				break;
			case "Offer":
				curApps = offerApps;
				curApps.push(newApp);
				localStorage.setItem(`${status}`, JSON.stringify(curApps));
				break;
			case "Rejected":
				curApps = rejectedApps;
				curApps.push(newApp);
				localStorage.setItem(`${status}`, JSON.stringify(curApps));
				break;
			default:
				console.log("Invalid status");
		}
		toggleForm();
	};

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
		<>
			{showForm &&
				ReactDOM.createPortal(
					<>
						{" "}
						<ApplicationForm
							toggleForm={toggleForm}
							addApplication={addApplication}
						/>
						<BackDrop toggleForm={toggleForm}></BackDrop>
					</>,
					portal
				)}
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
						<AppTrackDivider
							apps={offerApps}
							filter={offerFilter}
						/>
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
				<IconButton
					className={styles.iconBtn}
					size="small"
					onClick={toggleForm}>
					<Icon fontSize="large">add_circle</Icon>
				</IconButton>
			</div>
		</>
	);
};

export default TrackingContent;
