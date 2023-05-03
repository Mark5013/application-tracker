import useHttpReq from "./use-HttpReq";
import UserContext from "../store/userContext";
import { useContext } from "react";

// uses refresh token to create new access token
const useRefreshToken = () => {
	const sendReq = useHttpReq();
	const userCtx = useContext(UserContext);

	const refresh = async () => {
		let response;
		try {
			response = await sendReq(
				"http://localhost:5000/auth/refresh",
				"GET",
				{},
				null,
				"include"
			);
		} catch (err) {
			console.log(err);
		}

		console.log(`data from refresh route: ${response}`);

		userCtx.login(
			response.id,
			response.email,
			response.firstName,
			response.lastName,
			response.message
		);

		// return the created accessToken
		return response.message;
	};

	return refresh;
};

export default useRefreshToken;
