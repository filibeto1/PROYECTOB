const Horario = require('../models/horarioSchema');

// Controlador para crear un nuevo horario
exports.getAllHorarios = async (req, res) => {
  try {
      const horarios = await Horario.find();
      res.json(horarios);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

exports.createHorario = async (req, res) => {
  const horario = new Horario({
      nombreEmpleado: req.body.nombreEmpleado,
      nombreAdmin: req.body.nombreAdmin,
      contrato: req.body.contrato,
      turno: req.body.turno,
      estadoSolicitud: req.body.estadoSolicitud,
      correo: req.body.correo,
      razon: req.body.razon,
      fecha: req.body.fecha
  });

  try {
      const nuevoHorario = await horario.save();
      res.status(201).json(nuevoHorario);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};

exports.updateHorario = async (req, res) => {
  try {
      const horarioActualizado = await Horario.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!horarioActualizado) {
          return res.status(404).json({ message: "Horario no encontrado" });
      }
      res.json({ message: "Horario actualizado correctamente", horario: horarioActualizado });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

exports.deleteHorario = async (req, res) => {
  try {
      const horarioEliminado = await Horario.findByIdAndDelete(req.params.id);
      if (!horarioEliminado) {
          return res.status(404).json({ message: "Horario no encontrado" });
      }
      res.json({ message: "Horario eliminado correctamente", horario: horarioEliminado });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};
