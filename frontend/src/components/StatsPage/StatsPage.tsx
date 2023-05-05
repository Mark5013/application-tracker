import React from "react";
import Header from "../AppTrackPage/Header/Header";
import Footer from "../Shared/Footer/Footer";
import StatsContent from "./StatsContent/StatsContent";

const StatsPage: React.FC = () => {
	return (
		<>
			<Header />
			<StatsContent />
			<Footer />
		</>
	);
};

export default StatsPage;
