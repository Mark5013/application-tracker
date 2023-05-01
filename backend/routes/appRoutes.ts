import express from "express";
import { addApplication } from "../controllers/appControllers";

const router = express.Router();

router.post("/addApplication", addApplication);

export { router as appRoutes };
