import React from "react";
import Header from "./Header/Header";
import TrackingContent from "./TrackingContent/TrackingContent";
import Footer from "../Shared/Footer/Footer";

const AppTrackPage: React.FC = () => {
	return (
		<>
			<Header />
			<TrackingContent />
			<Footer />
		</>
	);
};

export default AppTrackPage;
