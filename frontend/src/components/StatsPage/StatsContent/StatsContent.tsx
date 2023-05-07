import React, { useState } from "react";
import styles from "./StatsContent.module.css";
import domtoimage from "dom-to-image";
import fileDownload from "js-file-download";
import { Button } from "@mui/material";
import MenuPopupState from "../../Shared/PopUpMenu";
import PiChart from "./GraphTypes/PiChart";
import LChart from "./GraphTypes/LineChart";
import BChart from "./GraphTypes/BChart";

const StatsContent = () => {
	const [graphStyle, setGraphStyle] = useState("Bar");

	const handleSaveClick = () => {
		domtoimage
			.toBlob(document.getElementById("node-to-convert")!)
			.then(function (blob) {
				fileDownload(blob, "dom-to-image.png");
			});
	};

	return (
		<>
			<div className={styles.buttons}>
				<MenuPopupState
					title="Chart Type"
					items={["Bar", "Pie", "Line"]}
					clickFunc={setGraphStyle}
				/>
			</div>
			<div className={styles.content}>
				<div className={styles.graph} id="node-to-convert">
					{graphStyle === "Bar" && <BChart />}
					{graphStyle === "Pie" && <PiChart />}
					{graphStyle === "Line" && <LChart />}
				</div>
			</div>
			<div className={styles.buttons}>
				<Button
					variant="contained"
					size="small"
					onClick={handleSaveClick}>
					Download
				</Button>
			</div>
		</>
	);
};

export default StatsContent;
