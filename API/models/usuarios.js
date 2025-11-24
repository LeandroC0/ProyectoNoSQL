const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true
        },
        telefono: {
            type: String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        },
        rol: {
            type: String,
            enum: ['adoptante', 'refugio'],
            required: true
        },
        fechaRegistro: {
            type: String, 
            required: true
        }
    },
    {
        collection: 'usuarios'
    }
);

module.exports = mongoose.model('Usuario', UsuarioSchema);
