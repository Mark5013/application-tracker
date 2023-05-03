import React from "react";
import AppTrackPage from "./components/AppTrackPage/AppTrackPage";
import LoginPage from "./components/LoginPage/LoginPage";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/Shared/RequireAuth";
import PersistLogin from "./components/Shared/PersistLogin";

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth />}>
						<Route path="/apps" element={<AppTrackPage />} />
					</Route>
				</Route>
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
