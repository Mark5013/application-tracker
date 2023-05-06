import express from "express";
import {
	statusStats,
	statusOverTimeStats,
} from "../controllers/statController";

const router = express.Router();

router.get("/statusStats/:uid", statusStats);

router.get("/statusOverTime/:uid", statusOverTimeStats);

export { router as statRoutes };
