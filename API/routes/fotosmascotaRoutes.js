const express = require('express');
const route = express.Router();

const FotoMascota = require('../models/fotosmascota');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        idFoto,
        mascota,
        url,
        descripcion,
        fechaSubida
    } = req.body;

    const nuevoFotoMascota = new FotoMascota({
        idFoto,
        mascota,
        url,
        descripcion,
        fechaSubida
    });

    try {
        const fotosmascotaGuardado = await nuevoFotoMascota.save();
        resp.status(201).json(fotosmascotaGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const fotosmascota = await FotoMascota.find();
        resp.status(200).json(fotosmascota);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const fotosmascotas = await FotoMascota.findById(req.params.id);
        if (!fotosmascotas) {
            return resp.status(404).json({ mensaje: "Foto Mascota no encontrada" });
        }
        resp.status(200).json(fotosmascotas);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const fotosmascotasActualizado = await FotoMascota.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!fotosmascotasActualizado) {
            return resp.status(404).json({ mensaje: "Foto Mascota no encontrada" });
        }

        resp.status(200).json(fotosmascotasActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const usuarioEliminado = await FotoMascota.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return resp.status(404).json({ mensaje: "Foto Mascota no encontrada" });
        }

        resp.status(200).json({ mensaje: "Foto Mascota eliminada correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
