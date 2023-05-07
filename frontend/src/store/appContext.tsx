import React, {
	useState,
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
} from "react";
import UserContext from "./userContext";
import useHttpReq from "../hooks/use-HttpReq";

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

type AppContextType = {
	appliedApps: App[];
	setAppliedApps: Dispatch<SetStateAction<App[]>>;
	inProgressApps: App[];
	setInProgressApps: Dispatch<SetStateAction<App[]>>;
	offerApps: App[];
	setOfferApps: Dispatch<SetStateAction<App[]>>;
	rejectedApps: App[];
	setRejectedApps: Dispatch<SetStateAction<App[]>>;
	appliedFilter: string;
	setAppliedFilter: Dispatch<SetStateAction<string>>;
	inProgressFilter: string;
	setInProgressFilter: Dispatch<SetStateAction<string>>;
	offerFilter: string;
	setOfferFilter: Dispatch<SetStateAction<string>>;
	rejectedFilter: string;
	setRejectedFilter: Dispatch<SetStateAction<string>>;
	applicationHash: { [key: string]: App[] };
	setApplicationHash: { [key: string]: Dispatch<SetStateAction<App[]>> };
	fetchApps: () => void;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = (props: any) => {
	const userCtx = useContext(UserContext);
	const sendReq = useHttpReq();

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

	const applicationHash: { [key: string]: App[] } = {
		Applied: appliedApps,
		"In-Progress": inProgressApps,
		Offer: offerApps,
		Rejected: rejectedApps,
	};

	// status -> set application arr mapping
	const setApplicationHash: {
		[key: string]: Dispatch<SetStateAction<App[]>>;
	} = {
		Applied: setAppliedApps,
		"In-Progress": setInProgressApps,
		Offer: setOfferApps,
		Rejected: setRejectedApps,
	};

	const fetchApps = () => {
		let applications: any;

		// gets apps from database
		const getApps = async () => {
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
				(app: App) => app.status === "Applied"
			);

			const pApps = applications.filter(
				(app: App) => app.status === "In-Progress"
			);

			const oApps = applications.filter(
				(app: App) => app.status === "Offer"
			);

			const rApps = applications.filter(
				(app: App) => app.status === "Rejected"
			);

			setAppliedApps([...aApps]);
			setInProgressApps([...pApps]);
			setOfferApps([...oApps]);
			setRejectedApps([...rApps]);
		};

		setUpApps();
	};

	const AppContextValue = {
		appliedApps,
		setAppliedApps,
		inProgressApps,
		setInProgressApps,
		offerApps,
		setOfferApps,
		rejectedApps,
		setRejectedApps,
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
	};

	return (
		<AppContext.Provider value={AppContextValue}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContext;
