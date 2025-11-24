const mongoose = require('mongoose');

const RegistroSchema = new mongoose.Schema(
    {
        usuario: {
            type: String,
            required: true
        },
        accion: {
            type: String,
            enum: ['Ingreso', 'Adopción'],
            required: true
        },
        mascota: {
            type: String,
            required: true
        },
        fecha: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        }
    },
    {
        collection: 'registros' 
    }
);

module.exports = mongoose.model('Registro', RegistroSchema);
