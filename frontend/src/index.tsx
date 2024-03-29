import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserContextProvider } from "./store/userContext";
import { AppContextProvider } from "./store/appContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<UserContextProvider>
			<AppContextProvider>
				<App />
			</AppContextProvider>
		</UserContextProvider>
	</React.StrictMode>
);
