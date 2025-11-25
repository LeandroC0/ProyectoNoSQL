const express = require('express');
const route = express.Router();

const Reseña = require('../models/reseñas');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const {
        usuario,
        mascota,
        refugio,
        calificacion,
        comentario,
        fecha
    } = req.body;

    const nuevaReseña = new Reseña({
        usuario,
        mascota,
        refugio,
        calificacion,
        comentario,
        fecha
    });

    try {
        const reseñaGuardada = await nuevaReseña.save();
        resp.status(201).json(reseñaGuardada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const reseñas = await Reseña.find();
        resp.status(200).json(reseñas);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});
route.get('/:id', async (req, resp) => {
    try {
        const reseña = await Reseña.findById(req.params.id);

        if (!reseña) {
            return resp.status(404).json({ mensaje: "Reseña no encontrada" });
        }

        resp.status(200).json(reseña);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});
// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const reseñaActualizada = await Reseña.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!reseñaActualizada) {
            return resp.status(404).json({ mensaje: "Reseña no encontrada" });
        }

        resp.status(200).json(reseñaActualizada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const reseñaEliminada = await Reseña.findByIdAndDelete(req.params.id);

        if (!reseñaEliminada) {
            return resp.status(404).json({ mensaje: "Reseña no encontrada" });
        }

        resp.status(200).json({ mensaje: "Reseña eliminada correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
