import { Router } from "express";
import { saveAppointment, getUserAppointment, updateAppointment, cancelledAppointment } from "./appointment.controller.js";
import { createAppointmentValidator } from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);
router.get("/userAppointment/:uid", getUserAppointment)
router.patch("/updateAppointment/:uid", updateAppointment)
router.delete("/cancelledAppointment/:uid", cancelledAppointment)

export default router;