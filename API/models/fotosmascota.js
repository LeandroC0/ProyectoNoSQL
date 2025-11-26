const mongoose = require('mongoose');

const FotoMascotaSchema = new mongoose.Schema(
    {
        idFoto: {
            type: String,
            required: true
        },
        mascota: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        descripcion: {
            type: String
        },
        fechaSubida: {
            type: String,
            required: true
        }
    },
    {
        collection: 'fotosMascota'
    }
);

module.exports = mongoose.model('FotoMascota', FotoMascotaSchema);
