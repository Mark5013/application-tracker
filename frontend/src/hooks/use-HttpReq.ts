import { useCallback } from "react";

const useHttpReq = () => {
	const sendReq = useCallback(
		async (
			url: string,
			method = "GET",
			headers = {},
			body: any = null,
			credentials: RequestCredentials = "omit"
		) => {
			try {
				const res = await fetch(`${url}`, {
					method,
					credentials,
					headers,
					body,
				});

				const resData = await res.json();

				if (!res.ok) {
					throw new Error("Something went wrong with http request");
				}

				return resData;
			} catch (err) {}
		},
		[]
	);

	return sendReq;
};

export default useHttpReq;
