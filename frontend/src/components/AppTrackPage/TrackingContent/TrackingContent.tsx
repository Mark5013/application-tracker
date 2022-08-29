import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./TrackingContent.module.css";
import AppTrackDivider from "./AppTrackDivider";
import Application from "./Application";
import BackDrop from "../../Shared/BackDrop";
import ApplicationForm from "./ApplicationForm";
import { useState } from "react";
import { Grid, Icon, IconButton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

class App {
	company: string;
	position: string;
	date: string;
	status: string;
	id: string;
	constructor(
		company: string,
		position: string,
		date: string,
		status: string,
		id: string
	) {
		this.company = company;
		this.position = position;
		this.date = date;
		this.status = status;
		this.id = id;
	}
}

const portal = document.getElementById("backdrop")! as HTMLDivElement;

const TrackingContent: React.FC = () => {
	// all applications
	const [appliedApps, setAppliedApps] = useState<App[]>([]);
	const [inProgressApps, setInProgressApps] = useState<App[]>([]);
	const [offerApps, setOfferApps] = useState<App[]>([]);
	const [rejectedApps, setRejectedApps] = useState<App[]>([]);

	// status -> application arr mapping
	const applicationHash: { [key: string]: App[] } = {
		Applied: appliedApps,
		"In-Progress": inProgressApps,
		Offer: offerApps,
		Rejected: rejectedApps,
	};

	// status -> set application arr mapping
	const setApplicationHash: { [key: string]: Function } = {
		Applied: setAppliedApps,
		"In-Progress": setInProgressApps,
		Offer: setOfferApps,
		Rejected: setRejectedApps,
	};

	// filters for apps
	const [appliedFilter, setAppliedFilter] = useState("");
	const [inProgressFilter, setInProgressFilter] = useState("");
	const [offerFilter, setOfferFilter] = useState("");
	const [rejectedFilter, setRejectedFilter] = useState("");

	// toggle for application form
	const [showForm, setShowForm] = useState(false);

	// load up users apps from local storage, soon to be connected to database
	useEffect(() => {
		setAppliedApps(JSON.parse(localStorage.getItem("Applied") || "[]"));
		setInProgressApps(
			JSON.parse(localStorage.getItem("In-Progress") || "[]")
		);
		setOfferApps(JSON.parse(localStorage.getItem("Offer") || "[]"));
		setRejectedApps(JSON.parse(localStorage.getItem("Rejected") || "[]"));
	}, []);

	// toggles form
	const toggleForm = () => {
		setShowForm((prev) => !prev);
	};

	// creates application and adds it to proper storage in local storage
	// soon to be connected to data base
	const addApplication = (
		companyName: string,
		position: string,
		date: string,
		status: string
	) => {
		//create app
		const newApp = new App(companyName, position, date, status, uuidv4());
		let curApps = applicationHash[status];
		const setCurApps = setApplicationHash[status];

		curApps.push(newApp);
		localStorage.setItem(`${status}`, JSON.stringify(curApps));
		setCurApps(curApps);

		// close form
		toggleForm();
	};

	// edits an application
	const editApplication = (
		appId: string,
		companyName: string,
		position: string,
		date: string,
		status: string
	) => {
		// get corresponding arr and set arr function
		let curApps = applicationHash[status];
		const setCurApps = setApplicationHash[status];

		// edit app
		let appToEdit = curApps.find((app) => app.id == appId);
		if (appToEdit) {
			appToEdit.company = companyName;
			appToEdit.position = position;
			appToEdit.date = date;
			appToEdit.status = status;
			localStorage.setItem(`${status}`, JSON.stringify(curApps));
			// spread operator so react realizes something changed
			setCurApps([...curApps]);
		}
	};

	// deletes an app
	const deleteApp = (appId: string, status: string) => {
		let curApps = applicationHash[status];
		let setCurApps = setApplicationHash[status];

		const filteredApps = curApps.filter((app) => app.id !== appId);
		localStorage.setItem(`${status}`, JSON.stringify(filteredApps));
		setCurApps(filteredApps);
	};

	// handles changes for applied app filter
	const handleAppliedFilter = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setAppliedFilter(event.currentTarget.value);
	};

	// handles changes for in progress app filter
	const handleInProgressFilter = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setInProgressFilter(event.currentTarget.value);
	};

	// handles changes for offer app filter
	const handleOfferFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOfferFilter(event.currentTarget.value);
	};

	// handles changes for rejected app filter
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
							companyName=""
							position=""
							status=""
							dateApplied=""
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
							deleteApp={deleteApp}
							toggleForm={toggleForm}
							editApp={editApplication}
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
							deleteApp={deleteApp}
							toggleForm={toggleForm}
							editApp={editApplication}
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
							deleteApp={deleteApp}
							toggleForm={toggleForm}
							editApp={editApplication}
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
							deleteApp={deleteApp}
							toggleForm={toggleForm}
							editApp={editApplication}
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
