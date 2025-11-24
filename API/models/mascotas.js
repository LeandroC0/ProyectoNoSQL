const mongoose = require('mongoose');

const MascotaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        tipoMascotaId: {
            type: String,
            required: true
        },
        raza: {
            type: String,
            required: true
        },
        edad: {
            type: Number,
            required: true
        },
        sexo: {
            type: String,
            enum: ['Macho', 'Hembra'],
            required: true
        },
        vacunas: {
            type: [String],
            required: true
        },
        estado: {
            type: String,
            enum: ['Disponible', 'Adoptado'],
            required: true,
            default: 'Disponible'
        },
        refugio: {
            type: String,
            required: true
        }
    },
    {
        collection: 'mascotas' 
    }
);

module.exports = mongoose.model('Mascota', MascotaSchema);
