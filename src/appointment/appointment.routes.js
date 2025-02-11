import { Router } from "express";
import { saveAppointment, getUserAppointment, updateAppointment, cancelledAppointment } from "./appointment.controller.js";
import { createAppointmentValidator, getAppointmentByIdValidator, updateAppointmentValidator, deleteAppointmentValidator} from "../middlewares/appointment-validators.js";

const router = Router();

//  - Los middlewares de validación (`getAppointmentByIdValidator`, `updateAppointmentValidator`, `deleteAppointmentValidator`) son esenciales para garantizar que los datos de entrada sean correctos antes de pasar al controlador.
router.post("/createAppointment", createAppointmentValidator, saveAppointment);
// Obtiene un listado de las citas de un usuario específico.
router.get("/userAppointment/:uid", getAppointmentByIdValidator, getUserAppointment)
//Permite actualizar la fecha de una cita específica.
router.patch("/updateAppointment/:uid", updateAppointmentValidator, updateAppointment)
//Cambia el estado de una cita específica a "CANCELLED", permitiendo al usuario cancelar la cita.
router.delete("/cancelledAppointment/:uid", deleteAppointmentValidator, cancelledAppointment)

export default router;