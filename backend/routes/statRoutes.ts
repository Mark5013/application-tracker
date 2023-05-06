import express from "express";
import { statusStats } from "../controllers/statController";

const router = express.Router();

router.get("/statusStats/:uid", statusStats);

export { router as statRoutes };
