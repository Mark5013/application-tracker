import React, {
	useState,
	createContext,
	Dispatch,
	SetStateAction,
	ReactNode,
} from "react";

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
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = (props: any) => {
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
	};

	return (
		<AppContext.Provider value={AppContextValue}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContext;
