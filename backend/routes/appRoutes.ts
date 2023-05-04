import express from "express";
import {
	addApplication,
	getApplications,
	editApplication,
	deleteApplication,
} from "../controllers/appControllers";

const router = express.Router();

// add application to the user
router.post("/addApplication", addApplication);

// edit users application
router.put("/editApplication", editApplication);

router.delete("/deleteApplication/:uid/:appid", deleteApplication);

// get all of users applications
router.get("/getApps/:uid", getApplications);

export { router as appRoutes };
