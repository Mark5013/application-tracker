import React from "react";
import { useState, createContext } from "react";

const UserContext = createContext({
	user: {
		id: -1,
		email: "",
		firstName: "",
		lastName: "",
		isLoggedIn: false,
		accessToken: "",
	},
	login: (
		id: number,
		email: string,
		firstName: string,
		lastName: string,
		accessToken: string
	) => {},
	logout: () => {},
});

export const UserContextProvider = (props: any) => {
	const [user, setUser] = useState({
		id: -1,
		email: "",
		firstName: "",
		lastName: "",
		isLoggedIn: false,
		accessToken: "",
	});

	const login = (
		id: number,
		email: string,
		firstName: string,
		lastName: string,
		accessToken: string
	) => {
		setUser({
			id,
			email,
			firstName,
			lastName,
			isLoggedIn: true,
			accessToken,
		});
	};

	const logout = () => {
		setUser({
			id: -1,
			email: "",
			firstName: "",
			lastName: "",
			isLoggedIn: false,
			accessToken: "",
		});
	};

	const UserContextValue = { user, login, logout, setUser };

	return (
		<UserContext.Provider value={UserContextValue}>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
