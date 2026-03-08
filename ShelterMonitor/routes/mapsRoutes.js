import express from "express";
import mapsController from "../controllers/maps.js";

const router = express.Router();

router.get("/", mapsController.getMaps);
router.get("/:id", mapsController.getMapById);
router.post("/", mapsController.insertMap);
router.put("/:id", mapsController.updateMap);
router.delete("/:id", mapsController.deleteMap);

export default router;