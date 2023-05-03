export const ValidateEmail = (mail: string) => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return true;
	}
	return false;
};

export const ValidatePassword = (password: string) => {
	if (
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
			password
		)
	) {
		return true;
	}
	return false;
};
