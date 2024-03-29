import React, { MouseEventHandler, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./TrackingContent.module.css";
import AppTrackDivider from "./AppTrackDivider";
import BackDrop from "../../Shared/BackDrop";
import ApplicationForm from "./ApplicationForm";
import { useState, useContext } from "react";
import { Grid, Icon, IconButton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import useHttpReq from "../../../hooks/use-HttpReq";
import UserContext from "../../../store/userContext";
import AppContext from "../../../store/appContext";
import ErrorModal from "../../Shared/ErrorModal";
import MenuPopupState from "../../Shared/PopUpMenu";

class App {
	company: string;
	position: string;
	date: string;
	status: string;
	appid: string;
	uid: number;
	season: string;
	constructor(
		company: string,
		position: string,
		date: string,
		status: string,
		appid: string,
		uid: number,
		season: string
	) {
		this.company = company;
		this.position = position;
		this.date = date;
		this.status = status;
		this.appid = appid;
		this.uid = uid;
		this.season = season;
	}
}

const portal = document.getElementById("backdrop")! as HTMLDivElement;

const TrackingContent: React.FC = () => {
	const sendReq = useHttpReq();
	const userCtx = useContext(UserContext);
	const appCtx = useContext(AppContext);
	const [isError, setIsError] = useState(false);

	const {
		appliedApps,
		inProgressApps,
		offerApps,
		rejectedApps,
		appliedFilter,
		setAppliedFilter,
		inProgressFilter,
		setInProgressFilter,
		offerFilter,
		setOfferFilter,
		rejectedFilter,
		setRejectedFilter,
		applicationHash,
		setApplicationHash,
		fetchApps,
		season,
		setSeason,
	} = appCtx;

	// toggle for application form
	const [showForm, setShowForm] = useState(false);

	// load up users apps from database
	useEffect(fetchApps, [season]);

	// toggles form
	const toggleForm = () => {
		setShowForm((prev) => !prev);
	};

	// creates application and adds it to database
	const addApplication = async (
		companyName: string,
		position: string,
		date: string,
		status: string
	) => {
		//create app
		const appId = uuidv4();

		// create applications
		const newApp = new App(
			companyName,
			position,
			date,
			status,
			appId,
			userCtx.user.id,
			season
		);

		// get w/e applicaiton list and corresponding function based off the apps satus
		let curApps = applicationHash[status];
		const setCurApps = setApplicationHash[status];

		try {
			await sendReq(
				"http://localhost:5000/apps/addApplication",
				"POST",
				{
					"Content-type": "application/json",
					Authorization: `Bearer ${userCtx.user.accessToken}`,
				},
				JSON.stringify(newApp)
			);
			// push into list and set it
			curApps.push(newApp);
			setCurApps(curApps);
		} catch (err) {
			// if error show error modal
			setIsError((prev) => !prev);
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
		if (prevStatus !== status) {
			oldApps = applicationHash[prevStatus];
			setOldApps = setApplicationHash[prevStatus];
			appToEdit = oldApps.find((app) => app.appid === appId);
		} else {
			// if not, just use cur apps
			appToEdit = curApps.find((app) => app.appid === appId);
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
				await sendReq(
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
				// if status has changed, filter old one, update old one, and set old one
				if (oldApps && setOldApps) {
					const filteredOldApps = oldApps.filter(
						(app) => app.appid !== appId
					);

					setOldApps(filteredOldApps);
				}
				// spread operator so react realizes something changed
				setCurApps([...curApps]);
			} catch (err) {
				setIsError((prev) => !prev);
			}
		}
	};

	// deletes an app
	const deleteApp = async (appId: string, status: string) => {
		// corresponding app list and set list function based off apps status
		let curApps = applicationHash[status];
		let setCurApps = setApplicationHash[status];

		// filter apps to remove app from list client side
		const filteredApps = curApps.filter((app) => app.appid !== appId);

		// remove from database
		try {
			await sendReq(
				`http://localhost:5000/apps/deleteApplication/${userCtx.user.id}/${appId}`,
				"DELETE",
				{ Authorization: `Bearer ${userCtx.user.accessToken}` }
			);

			setCurApps(filteredApps);
		} catch (err) {
			// if error show modal
			setIsError((prev) => !prev);
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

	const handleErrorClick: MouseEventHandler<
		HTMLButtonElement | HTMLDivElement
	> = () => {
		setIsError((prev) => !prev);
	};

	return (
		<>
			{isError &&
				ReactDOM.createPortal(
					<>
						<ErrorModal
							text="Something went wrong!"
							handleClick={handleErrorClick}
						/>
						<BackDrop toggleForm={handleErrorClick}></BackDrop>
					</>,
					portal
				)}
			{showForm &&
				ReactDOM.createPortal(
					<>
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
				<div className={styles.btn}>
					<MenuPopupState
						title={`Season: ${season}`}
						items={[
							"Fall 23",
							"Winter 23",
							"Spring 24",
							"Summer 24",
							"Fall 24",
							"Winter 24",
							"Spring 25",
						]}
						clickFunc={setSeason}
					/>
				</div>
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
