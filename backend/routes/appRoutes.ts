import express from "express";
import { addApplication, getApplications } from "../controllers/appControllers";

const router = express.Router();

// add application to the user
router.post("/addApplication", addApplication);

// get all of users applications
router.get("/getApps/:uid", getApplications);

export { router as appRoutes };
