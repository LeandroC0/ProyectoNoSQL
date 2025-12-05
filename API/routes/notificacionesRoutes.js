const express = require('express');
const route = express.Router();

const Notificaciones = require('../models/notificaciones');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        idNotificacion,
        usuario,
        mensaje,
        tipo,
        leida,
        fecha
    } = req.body;

    const nuevoNotificaciones = new Notificaciones({
        idNotificacion,
        usuario,
        mensaje,
        tipo,
        leida,
        fecha
    });

    try {
        const notificacionesGuardado = await nuevoNotificaciones.save();
        resp.status(201).json(notificacionesGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const notificaciones = await Notificaciones.find();
        resp.status(200).json(notificaciones);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const notificacion = await Notificaciones.findById(req.params.id);
        if (!notificacion) {
            return resp.status(404).json({ mensaje: "Notificaciones no encontradas" });
        }
        resp.status(200).json(notificacion);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const notificacionActualizado = await Notificaciones.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!notificacionActualizado) {
            return resp.status(404).json({ mensaje: "Notificaciones no encontradas" });
        }

        resp.status(200).json(notificacionActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const notificacionEliminado = await Notificaciones.findByIdAndDelete(req.params.id);

        if (!notificacionEliminado) {
            return resp.status(404).json({ mensaje: "Notificaciones no encontradas" });
        }

        resp.status(200).json({ mensaje: "Notificacion eliminada correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
