const mongoose = require('mongoose');

const PeticionAdopcionSchema = new mongoose.Schema(
    {
        idPeticion: {
            type: String,
            required: true
        },
        usuario: {
            type: String,
            required: true
        },
        mascota: {
            type: String,
            required: true
        },
        refugio: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            enum: ['Pendiente', 'Aprobada', 'Rechazada'],
            required: true
        },
        fechaPeticion: {
            type: String,
            required: true
        },
        fechaRespuesta: {
            type: String
        },
        notasRefugio: {
            type: String
        }
    },
    { collection: 'peticionesAdopcion' }
);

module.exports = mongoose.model('PeticionAdopcion', PeticionAdopcionSchema);
