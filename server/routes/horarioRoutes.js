const express = require('express');
const router = express.Router();
const Horario = require('../models/horarioSchema');
const empleadoController = require('../controllers/horarioController'); // Importa el controlador

// Ruta para obtener todos los horarios
router.get('/', async (req, res) => {
    try {
        const horarios = await Horario.find();
        res.json(horarios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para obtener un horario por su ID
router.get('/:id', async (req, res) => {
    try {
        const horario = await Horario.findById(req.params.id);
        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }
        res.json(horario);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para crear un nuevo horario
router.post('/', async (req, res) => {
    const horario = new Horario({
        nombreEmpleado: req.body.nombreEmpleado,
        nombreAdmin: req.body.nombreAdmin,
        contrato: req.body.contrato,
        turno: req.body.turno,
        estadoSolicitud: req.body.estadoSolicitud,
        correo: req.body.correo,
        razon: req.body.razon,
        fecha: req.body.fecha // Asegúrate de incluir el campo fecha
    });

    try {
        const nuevoHorario = await horario.save();
        res.status(201).json(nuevoHorario);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ruta para actualizar un horario
router.patch('/:id', empleadoController.updateHorario); // Usa el controlador

// Ruta para eliminar un horario por su ID
router.delete('/:nombre', async (req, res) => { // Cambia el parámetro de :id a :nombre
    try {
        const horarioEliminado = await Horario.findOneAndDelete({ nombreEmpleado: req.params.nombre }); // Busca y elimina por nombre
        if (!horarioEliminado) {
            return res.status(404).json({ message: "Horario no encontrado" });
        }
        res.json({ message: "Horario eliminado correctamente", horario: horarioEliminado });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
