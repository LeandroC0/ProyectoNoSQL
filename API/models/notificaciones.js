const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema(
    {
        idNotificacion: {
            type: String,
            required: true
        },
        usuario: {
            type: String,
            required: true
        },
        mensaje: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        leida: {
            type: Boolean,
            default: false
        },
        fecha: {
            type: String,
            required: true
        }
    },
    {
        collection: 'notificaciones'
    }
);

module.exports = mongoose.model('Notificacion', NotificacionSchema);
