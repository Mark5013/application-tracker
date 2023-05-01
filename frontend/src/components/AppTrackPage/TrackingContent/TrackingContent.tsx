import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./TrackingContent.module.css";
import AppTrackDivider from "./AppTrackDivider";
import Application from "./Application";
import BackDrop from "../../Shared/BackDrop";
import ApplicationForm from "./ApplicationForm";
import { useState, useContext } from "react";
import { Grid, Icon, IconButton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import useHttpReq from "../../../hooks/use-HttpReq";
import UserContext from "../../../store/userContext";

class App {
	company: string;
	position: string;
	date: string;
	status: string;
	id: string;
	uid: number;
	constructor(
		company: string,
		position: string,
		date: string,
		status: string,
		id: string,
		uid: number
	) {
		this.company = company;
		this.position = position;
		this.date = date;
		this.status = status;
		this.id = id;
		this.uid = uid;
	}
}

const portal = document.getElementById("backdrop")! as HTMLDivElement;

const TrackingContent: React.FC = () => {
	const sendReq = useHttpReq();
	const userCtx = useContext(UserContext);

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
		const newApp = new App(
			companyName,
			position,
			date,
			status,
			uuidv4(),
			userCtx.user.id
		);
		let curApps = applicationHash[status];
		const setCurApps = setApplicationHash[status];

		try {
			const data = sendReq(
				"http://localhost:5000/apps/addApplication",
				"POST",
				{ "Content-type": "application/json" },
				JSON.stringify(newApp)
			);

			console.log(data);
		} catch (err) {}

		curApps.push(newApp);
		//localStorage.setItem(`${status}`, JSON.stringify(curApps));
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
		status: string,
		prevStatus: string
	) => {
		// old apps and set old apps in case status has changed
		let oldApps;
		let setOldApps;
		let appToEdit;

		// get corresponding arr and set arr function
		let curApps = applicationHash[status];
		const setCurApps = setApplicationHash[status];

		// if status has changed get old apps, set old apps, and the app from the arr
		if (prevStatus != status) {
			oldApps = applicationHash[prevStatus];
			setOldApps = setApplicationHash[prevStatus];
			appToEdit = oldApps.find((app) => app.id === appId);
		} else {
			// if not, just use cur apps
			appToEdit = curApps.find((app) => app.id == appId);
		}

		// edit app
		if (appToEdit) {
			appToEdit.company = companyName;
			appToEdit.position = position;
			appToEdit.date = date;
			appToEdit.status = status;

			// if status has changed, push into new arr
			if (prevStatus !== status) {
				curApps.push(appToEdit);
			}
			// set new arr in local storage
			localStorage.setItem(`${status}`, JSON.stringify(curApps));

			// if status has changed, filter old one, update old one in local storage, and set old one
			if (oldApps && setOldApps) {
				const filteredOldApps = oldApps.filter(
					(app) => app.id !== appId
				);
				localStorage.setItem(
					`${prevStatus}`,
					JSON.stringify(filteredOldApps)
				);
				setOldApps(filteredOldApps);
			}
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
			<div className={styles.main}>
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
