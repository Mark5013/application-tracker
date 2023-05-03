import { Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import UserContext from "../../store/userContext";
import React from "react";

// persist login across refreshes
const PersistLogin = () => {
	const userCtx = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		};

		!userCtx.user.accessToken ? verifyRefreshToken() : setIsLoading(false);
	}, []);

	return <>{isLoading ? <p>Loading...</p> : <Outlet />} </>;
};

export default PersistLogin;
