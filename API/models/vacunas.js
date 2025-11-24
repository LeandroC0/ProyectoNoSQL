const mongoose = require('mongoose');

const VacunaSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            unique: true
        },
        nombre: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        aplicableA: {
            type: [String],   
            required: true
        }
    },
    {
        collection: 'vacunas'   
    }
);

module.exports = mongoose.model('Vacuna', VacunaSchema);
