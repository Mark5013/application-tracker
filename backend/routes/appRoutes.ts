import express from "express";
import { addApplication, getApplications } from "../controllers/appControllers";

const router = express.Router();

router.post("/addApplication", addApplication);

router.get("/getApps/:uid", getApplications);

export { router as appRoutes };
