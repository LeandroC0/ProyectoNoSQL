const mongoose = require('mongoose');

const ParteMedicoSchema = new mongoose.Schema(
    {
        idHistorial: {
            type: String,
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
        veterinario: {
            type: String,
            required: true
        },
        diagnostico: {
            type: String,
            required: true
        },
        tratamiento: {
            type: String,
            required: true
        },
        proximaCita: {
            type: String
        }
    },
    {
        collection: 'parteMedico'
    }
);

module.exports = mongoose.model('ParteMedico', ParteMedicoSchema);
