const express = require('express');
const route = express.Router();

const TipoMascota = require('../models/tipomascota');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { tipoMascotaId, nombre, descripcion } = req.body;

    const nuevoTipo = new TipoMascota({
        tipoMascotaId,
        nombre,
        descripcion
    });

    try {
        const tipoGuardado = await nuevoTipo.save();
        resp.status(201).json(tipoGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const tipos = await TipoMascota.find();
        resp.status(200).json(tipos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const tipoActualizado = await TipoMascota.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!tipoActualizado) {
            return resp.status(404).json({ mensaje: "Tipo de mascota no encontrado" });
        }

        resp.status(200).json(tipoActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const tipoEliminado = await TipoMascota.findByIdAndDelete(req.params.id);

        if (!tipoEliminado) {
            return resp.status(404).json({ mensaje: "Tipo de mascota no encontrado" });
        }

        resp.status(200).json({ mensaje: "Tipo de mascota eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
