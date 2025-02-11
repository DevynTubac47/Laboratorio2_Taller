import { Router } from "express";
import { saveAppointment, getUserAppointment, updateAppointment, cancelledAppointment } from "./appointment.controller.js";
import { createAppointmentValidator, getAppointmentByIdValidator, updateAppointmentValidator, deleteAppointmentValidator} from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);
router.get("/userAppointment/:uid", getAppointmentByIdValidator, getUserAppointment)
router.patch("/updateAppointment/:uid", updateAppointmentValidator, updateAppointment)
router.delete("/cancelledAppointment/:uid", deleteAppointmentValidator, cancelledAppointment)

export default router;