const mongoose = require('mongoose');

const TipoMascotaSchema = new mongoose.Schema(
    {
        tipoMascotaId: {
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
        }
    },
    {
        collection: 'tipomascota' 
    }
);

module.exports = mongoose.model('TipoMascota', TipoMascotaSchema);
