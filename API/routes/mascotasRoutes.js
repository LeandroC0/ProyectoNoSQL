const express = require('express');
const route = express.Router();

const Mascota = require('../models/mascotas');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        nombre,
        tipoMascotaId,
        raza,
        edad,
        sexo,
        vacunas,
        estado,
        refugio
    } = req.body;

    const nuevaMascota = new Mascota({
        nombre,
        tipoMascotaId,
        raza,
        edad,
        sexo,
        vacunas,
        estado,
        refugio
    });

    try {
        const mascotaGuardada = await nuevaMascota.save();
        resp.status(201).json(mascotaGuardada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const mascotas = await Mascota.find();
        resp.status(200).json(mascotas);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});



route.get('/:id', async (req, resp) => {
    try {
        const mascota = await Mascota.findById(req.params.id);

        if (!mascota) {
            return resp.status(404).json({ mensaje: "Mascota no encontrada" });
        }

        resp.status(200).json(mascota);

    } catch (error) {
        console.log("Error en GET por ID:", error.message);
        resp.status(500).json({ mensaje: error.message });
    }
});
// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const mascotaActualizada = await Mascota.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!mascotaActualizada) {
            return resp.status(404).json({ mensaje: "Mascota no encontrada" });
        }

        resp.status(200).json(mascotaActualizada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const mascotaEliminada = await Mascota.findByIdAndDelete(req.params.id);

        if (!mascotaEliminada) {
            return resp.status(404).json({ mensaje: "Mascota no encontrada" });
        }

        resp.status(200).json({ mensaje: "Mascota eliminada correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
