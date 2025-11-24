const express = require('express');
const route = express.Router();

const Registro = require('../models/registros');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { usuario, accion, mascota, fecha, descripcion } = req.body;

    const nuevoRegistro = new Registro({
        usuario,
        accion,
        mascota,
        fecha,
        descripcion
    });

    try {
        const registroGuardado = await nuevoRegistro.save();
        resp.status(201).json(registroGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const registros = await Registro.find();
        resp.status(200).json(registros);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const registroActualizado = await Registro.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!registroActualizado) {
            return resp.status(404).json({ mensaje: "Registro no encontrado" });
        }

        resp.status(200).json(registroActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const registroEliminado = await Registro.findByIdAndDelete(req.params.id);

        if (!registroEliminado) {
            return resp.status(404).json({ mensaje: "Registro no encontrado" });
        }

        resp.status(200).json({ mensaje: "Registro eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
