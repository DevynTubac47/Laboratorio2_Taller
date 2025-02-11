import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import User from "../user/user.model.js";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;

    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        msg: "No se encontró la mascota" 
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      msg: "Error al crear la cita", 
      error 
    }); 
  }
};

/*
  Funcionalidad para Listar las Citas del Usuario.
  Esta función permite listar las citas asociadas a un usuario específico.
  Recibe parámetros opcionales para paginar los resultados y retorna el listado de citas.
 */
export const getUserAppointment = async (req, res) => {
  try{
    //Define cuandos resultados se devolverán y define el indice desde donde iniciar la paginación.
    const { limite = 5, desde = 0} = req.query

    //Recibe como parametro el ID del usuario.
    const { uid } = req.params;
    //Valida y busca a el usuario en la base de datos.
    const user = await User.findById(uid)
    if(!user){
      return res.status(404).json({
          suceess: false,
          message: "Usuario no Encontrado"
      })
    }

    //Se define un objeto query que filtra las citas con estado "CREATED".
    const query = {status: "CREATED", user: uid}

    //Se utilizo Promise.all para ejecutar las tareas de manera concurrente.
    //Cuenta el número total de citas en la base de datos que cumplen con el filtro definido en query.
    const[total, appointment] = await Promise.all([
        Appointment.countDocuments(query),
        Appointment.find(query)
            .skip(Number(desde))
            .limit(Number(limite))            
    ])

    //Respuesta Exitosa, muestra el usuario y la lista de citas con el total de citas.
    return res.status(200).json({
        success: true,
        total,
        user,
        appointment
    })

  //Manejo de Errores
  }catch(err){
      return res.status(500).json({
          suceess: false,
          message: "Error al obtener los usuarios",
          error: err.message
      })
  }
}

/*
  Actualiza la fecha de la cita.
  Esta función actualiza la fecha de una cita en la base de datos.
  Y recibe el ID de la cita a actualizar y la nueva fecha.
*/
export const updateAppointment = async(req, res) => {
  try{
    const { uid } = req.params
    const { newDate } = req.body

    //Actualiza la cita
    //Se utiliza findByIdAndUpdate para actualizar la fecha y busca la cita por el ID.
    const appointment = await Appointment.findByIdAndUpdate(uid, { date: newDate }, { new: true });

    //Respuesta exitosa.
    return res.status(200).json({
      suceess: true,
      message: "Fecha actualizada",
      appointment
    })

    //Manejo de errores.
  }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la cita",
            error: err.message
        })
    }
}

/*
  Cancela una cita.
  Esta función cambia el estado de la cita a "CANCELLED" en la base de datos.
  Permite al usuario cancelar una cita específica por el ID
 */
export const cancelledAppointment = async (req, res) =>{
  try{
      //Obtiene el ID de la Cita
      const {uid} = req.params
      
      //Actualiza el estado de la cita. Busca la cita en la base de datos por el medio de la cita. Y asegura que devuelva la cita actualizada.
      const appointment = await Appointment.findByIdAndUpdate(uid, {status: "CANCELLED" }, {new: true})
      
      //Respuesta exitosa
      return res.status(200).json({
          sucess: true,
          message: "Cita Cancelada",
          appointment
      })
      //Manejo de Errores.
  }catch(err){
      return res.status(500).json({
          success: false,
          message: "Error al cancelar la cita",
          error: err.message
      })
  }
}