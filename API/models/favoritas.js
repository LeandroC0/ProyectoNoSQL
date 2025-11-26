const mongoose = require('mongoose');

const FavoritaSchema = new mongoose.Schema(
    {
        idFavorito: {
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
        fechaGuardado: {
            type: String,
            required: true
        }
    },
    {
        collection: 'favoritas'
    }
);

module.exports = mongoose.model('Favorita', FavoritaSchema);
