const mongoose = require('mongoose');

const ReseñaSchema = new mongoose.Schema(
    {
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
        calificacion: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comentario: {
            type: String,
            required: true
        },
        fecha: {
            type: String, 
            required: true
        }
    },
    {
        collection: 'reseñas' 
    }
);

module.exports = mongoose.model('Reseña', ReseñaSchema);
