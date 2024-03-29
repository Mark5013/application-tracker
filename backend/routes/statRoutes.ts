import express from "express";
import {
	statusStats,
	statusOverTimeStats,
} from "../controllers/statController";

const router = express.Router();

// get the total number of applied, inprogress, offer, and rejected applications for user
router.get("/statusStats/:uid/:season", statusStats);

// get total number of above statuses for a user,  but over time
router.get("/statusOverTime/:uid/:season", statusOverTimeStats);

export { router as statRoutes };
