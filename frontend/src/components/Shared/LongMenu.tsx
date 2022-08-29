import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface LongMenuProps {
	id: string;
	status: string;
	deleteApp: Function;
}

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

const LongMenu: React.FC<LongMenuProps> = (props) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event: React.MouseEvent<HTMLElement>) => {
		const input = event.nativeEvent as any;
		const action = input.target.outerText;

		if (action === "Edit") {
			//edit task thhrough function passed through props
		} else if (action === "Delete") {
			// delete this task
			props.deleteApp(props.id, props.status);
		}

		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton
				aria-label="more"
				id="long-button"
				aria-controls={open ? "long-menu" : undefined}
				aria-expanded={open ? "true" : undefined}
				aria-haspopup="true"
				onClick={handleClick}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="long-menu"
				MenuListProps={{
					"aria-labelledby": "long-button",
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: {
						maxHeight: ITEM_HEIGHT * 4.5,
						width: "20ch",
					},
				}}>
				{options.map((option) => (
					<MenuItem key={option} onClick={handleClose}>
						{option}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
};

export default LongMenu;
