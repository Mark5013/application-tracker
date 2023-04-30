import React from "react";
import { useState, createContext } from "react";

const UserContext = createContext({
	user: {
		id: -1,
		email: "",
		firstName: "",
		lastName: "",
		isLoggedIn: false,
	},
	login: (
		id: number,
		email: string,
		firstName: string,
		lastName: string
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
	});

	const login = (
		id: number,
		email: string,
		firstName: string,
		lastName: string
	) => {
		setUser({ id, email, firstName, lastName, isLoggedIn: true });
	};

	const logout = () => {
		setUser({
			id: -1,
			email: "",
			firstName: "",
			lastName: "",
			isLoggedIn: false,
		});
	};

	const UserContextValue = { user, login, logout };

	return (
		<UserContext.Provider value={UserContextValue}>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
