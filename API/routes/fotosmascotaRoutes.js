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

    const nuevaFoto = new FotoMascota({
        idFoto,
        mascota,
        url,
        descripcion,
        fechaSubida
    });

    try {
        const fotoGuardada = await nuevaFoto.save();
        resp.status(201).json(fotoGuardada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// READ - ALL
// ============================
route.get('/', async (req, resp) => {
    try {
        const fotos = await FotoMascota.find();
        resp.status(200).json(fotos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// READ - BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const foto = await FotoMascota.findOne({ idFoto: req.params.id });

        if (!foto) {
            return resp.status(404).json({ mensaje: "Foto no encontrada" });
        }

        resp.status(200).json(foto);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const fotoActualizada = await FotoMascota.findOneAndUpdate(
            { idFoto: req.params.id },
            req.body,
            { new: true }
        );

        if (!fotoActualizada) {
            return resp.status(404).json({ mensaje: "Foto no encontrada" });
        }

        resp.status(200).json(fotoActualizada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const fotoEliminada = await FotoMascota.findOneAndDelete({
            idFoto: req.params.id
        });

        if (!fotoEliminada) {
            return resp.status(404).json({ mensaje: "Foto no encontrada" });
        }

        resp.status(200).json({ mensaje: "Foto eliminada correctamente" });

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
