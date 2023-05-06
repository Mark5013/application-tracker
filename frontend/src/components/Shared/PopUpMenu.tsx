import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

type menuProps = {
	title: string;
	items: any[];
	clickFunc: any;
};

export default function MenuPopupState(props: menuProps) {
	const handleClick = (item: string, popupState: any) => {
		props.clickFunc(item);
		popupState.close();
	};

	return (
		<PopupState variant="popover" popupId="demo-popup-menu">
			{(popupState) => (
				<React.Fragment>
					<Button variant="contained" {...bindTrigger(popupState)}>
						{props.title}
					</Button>
					<Menu
						{...bindMenu(popupState)}
						PaperProps={{ sx: { width: "123px" } }}>
						{props.items.map((curItem) => (
							<MenuItem
								onClick={() => {
									handleClick(curItem, popupState);
								}}>
								{curItem}
							</MenuItem>
						))}
					</Menu>
				</React.Fragment>
			)}
		</PopupState>
	);
}
