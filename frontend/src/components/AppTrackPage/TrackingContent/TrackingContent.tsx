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
	appid: string;
	uid: number;
	constructor(
		company: string,
		position: string,
		date: string,
		status: string,
		appid: string,
		uid: number
	) {
		this.company = company;
		this.position = position;
		this.date = date;
		this.status = status;
		this.appid = appid;
		this.uid = uid;
	}
}

const portal = document.getElementById("backdrop")! as HTMLDivElement;

const TrackingContent: React.FC = () => {
	const sendReq = useHttpReq();
	const userCtx = useContext(UserContext);
	console.log(`app tracking page: ${JSON.stringify(userCtx.user)}`);

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
		let applications: any;

		// gets apps from database
		const getApps = async () => {
			console.log(`getting apps ${JSON.stringify(userCtx.user)}`);
			const res = await sendReq(
				`http://localhost:5000/apps/getApps/${userCtx.user.id}`,
				"GET",
				{ Authorization: `Bearer ${userCtx.user.accessToken}` }
			);
			applications = res.message;
		};

		// loads the apps into respective arrays
		const setUpApps = async () => {
			await getApps();

			const aApps = applications.filter(
				(app: App) => app.status == "Applied"
			);

			const pApps = applications.filter(
				(app: App) => app.status == "In-Progress"
			);

			const oApps = applications.filter(
				(app: App) => app.status == "Offer"
			);

			const rApps = applications.filter(
				(app: App) => app.status == "Rejected"
			);

			setAppliedApps([...aApps]);
			setInProgressApps([...pApps]);
			setOfferApps([...oApps]);
			setRejectedApps([...rApps]);
		};

		setUpApps();
	}, []);

	// toggles form
	const toggleForm = () => {
		setShowForm((prev) => !prev);
	};

	// creates application and adds it to proper storage in local storage
	// soon to be connected to data base
	const addApplication = async (
		companyName: string,
		position: string,
		date: string,
		status: string
	) => {
		//create app
		const appId = uuidv4();
		console.log(appId);
		const newApp = new App(
			companyName,
			position,
			date,
			status,
			appId,
			userCtx.user.id
		);
		let curApps = applicationHash[status];
		const setCurApps = setApplicationHash[status];

		try {
			const res = await sendReq(
				"http://localhost:5000/apps/addApplication",
				"POST",
				{
					"Content-type": "application/json",
					Authorization: `Bearer ${userCtx.user.accessToken}`,
				},
				JSON.stringify(newApp)
			);
			curApps.push(newApp);
			setCurApps(curApps);
		} catch (err) {
			console.log(err);
		}

		// close form
		toggleForm();
	};

	// edits an application
	const editApplication = async (
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
			appToEdit = oldApps.find((app) => app.appid === appId);
		} else {
			// if not, just use cur apps
			appToEdit = curApps.find((app) => app.appid == appId);
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
			try {
				const res = await sendReq(
					`http://localhost:5000/apps/editApplication`,
					"PUT",
					{
						"Content-type": "application/json",
						Authorization: `Bearer ${userCtx.user.accessToken}`,
					},
					JSON.stringify({
						appId,
						companyName,
						position,
						date,
						status,
						id: userCtx.user.id,
					})
				);

				// if status has changed, filter old one, update old one in local storage, and set old one
				if (oldApps && setOldApps) {
					const filteredOldApps = oldApps.filter(
						(app) => app.appid !== appId
					);

					setOldApps(filteredOldApps);
				}
				// spread operator so react realizes something changed
				setCurApps([...curApps]);
			} catch (err) {
				console.log(err);
			}
		}
	};

	// deletes an app
	const deleteApp = async (appId: string, status: string) => {
		let curApps = applicationHash[status];
		let setCurApps = setApplicationHash[status];

		const filteredApps = curApps.filter((app) => app.appid !== appId);
		//localStorage.setItem(`${status}`, JSON.stringify(filteredApps));
		try {
			const res = await sendReq(
				`http://localhost:5000/apps/deleteApplication/${userCtx.user.id}/${appId}`,
				"DELETE",
				{ Authorization: `Bearer ${userCtx.user.accessToken}` }
			);

			setCurApps(filteredApps);
			console.log(res.message);
		} catch (err) {
			console.log(err);
		}
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
