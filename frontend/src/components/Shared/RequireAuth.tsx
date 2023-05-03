import { Navigate, Outlet, useLocation } from "react-router-dom";
import UserContext from "../../store/userContext";
import { useContext } from "react";
import React from "react";

// ensure user is logged in to procede, if not send back to home page
const RequireAuth = () => {
	const userCtx = useContext(UserContext);
	const location = useLocation();

	return userCtx.user.isLoggedIn ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};

export default RequireAuth;
