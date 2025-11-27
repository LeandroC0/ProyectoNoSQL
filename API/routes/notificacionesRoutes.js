const express = require('express');
const route = express.Router();

const Notificacion = require('../models/notificaciones');

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

    const nuevaNotificacion = new Notificacion({
        idNotificacion,
        usuario,
        mensaje,
        tipo,
        leida,
        fecha
    });

    try {
        const guardada = await nuevaNotificacion.save();
        resp.status(201).json(guardada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// READ - ALL
// ============================
route.get('/', async (req, resp) => {
    try {
        const notificaciones = await Notificacion.find();
        resp.status(200).json(notificaciones);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// READ - BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const notificacion = await Notificacion.findOne({ idNotificacion: req.params.id });

        if (!notificacion) {
            return resp.status(404).json({ mensaje: "Notificación no encontrada" });
        }

        resp.status(200).json(notificacion);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const notificacionActualizada = await Notificacion.findOneAndUpdate(
            { idNotificacion: req.params.id },
            req.body,
            { new: true }
        );

        if (!notificacionActualizada) {
            return resp.status(404).json({ mensaje: "Notificación no encontrada" });
        }

        resp.status(200).json(notificacionActualizada);

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const eliminada = await Notificacion.findOneAndDelete({
            idNotificacion: req.params.id
        });

        if (!eliminada) {
            return resp.status(404).json({ mensaje: "Notificación no encontrada" });
        }

        resp.status(200).json({ mensaje: "Notificación eliminada correctamente" });

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
