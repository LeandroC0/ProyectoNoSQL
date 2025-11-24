const express = require('express');
const route = express.Router();

const Vacuna = require('../models/vacunas');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        codigo,
        nombre,
        descripcion,
        aplicableA
    } = req.body;

    const nuevaVacuna = new Vacuna({
        codigo,
        nombre,
        descripcion,
        aplicableA
    });

    try {
        const vacunaGuardada = await nuevaVacuna.save();
        resp.status(201).json(vacunaGuardada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const vacunas = await Vacuna.find();
        resp.status(200).json(vacunas);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const vacunaActualizada = await Vacuna.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!vacunaActualizada) {
            return resp.status(404).json({ mensaje: "Vacuna no encontrada" });
        }

        resp.status(200).json(vacunaActualizada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const vacunaEliminada = await Vacuna.findByIdAndDelete(req.params.id);

        if (!vacunaEliminada) {
            return resp.status(404).json({ mensaje: "Vacuna no encontrada" });
        }

        resp.status(200).json({ mensaje: "Vacuna eliminada correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
