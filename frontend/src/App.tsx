import React from "react";
import AppTrackPage from "./components/AppTrackPage/AppTrackPage";
import LoginPage from "./components/LoginPage/LoginPage";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AppTrackPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
