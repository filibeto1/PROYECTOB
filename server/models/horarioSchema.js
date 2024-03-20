const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
    nombreEmpleado: {
        type: String,
        required: true
    },
    nombreAdmin: {
        type: String,
        // Referencia al modelo de Administrador
        required: true
    },
    contrato: {
        type: String,
        required: true
    },
    turno: {
        type: String,
        required: true
    },
    estadoSolicitud: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true // Para asegurarse de que cada correo sea único
    },
    razon: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true // Fecha de solicitud, se establece automáticamente
    }
});

const Horario = mongoose.model('Horario', horarioSchema);

module.exports = Horario;

