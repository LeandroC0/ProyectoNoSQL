const express = require('express');
const route = express.Router();

const Favoritas = require('../models/favoritas');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        idFavorito,
        favorita,
        mascota,
        fechaGuardado
    } = req.body;

    const nuevoFavoritas = new Favoritas({
        idFavorito,
        favorita,
        mascota,
        fechaGuardado
    });

    try {
        const favoritasGuardado = await nuevoFavoritas.save();
        resp.status(201).json(favoritasGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const favoritas = await Favoritas.find();
        resp.status(200).json(favoritas);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const favorita = await Favoritas.findById(req.params.id);
        if (!favorita) {
            return resp.status(404).json({ mensaje: "Favoritas no encontrado" });
        }
        resp.status(200).json(favorita);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const favoritaActualizado = await Favoritas.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!favoritaActualizado) {
            return resp.status(404).json({ mensaje: "Favoritas no encontrado" });
        }

        resp.status(200).json(favoritaActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const favoritaEliminado = await Favoritas.findByIdAndDelete(req.params.id);

        if (!favoritaEliminado) {
            return resp.status(404).json({ mensaje: "Favoritas no encontrado" });
        }

        resp.status(200).json({ mensaje: "Favoritas eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
