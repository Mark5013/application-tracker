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
					throw new Error(resData.message);
				}

				return resData;
			} catch (err) {
				throw err;
			}
		},
		[]
	);

	return sendReq;
};

export default useHttpReq;
