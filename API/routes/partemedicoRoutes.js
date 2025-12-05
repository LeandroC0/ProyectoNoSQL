const express = require('express');
const route = express.Router();

const ParteMedico = require('../models/partemedico');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        idHistorial,
        mascota,
        fecha,
        veterinario,
        diagnostico,
        tratamiento,
        proximaCita
    } = req.body;

    const nuevoParteMedico = new ParteMedico({
        idHistorial,
        mascota,
        fecha,
        veterinario,
        diagnostico,
        tratamiento,
        proximaCita
    });

    try {
        const ParteMedicoGuardado = await nuevoParteMedico.save();
        resp.status(201).json(ParteMedicoGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const ParteMedicos = await ParteMedico.find();
        resp.status(200).json(ParteMedicos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const ParteMedico = await ParteMedico.findById(req.params.id);
        if (!ParteMedico) {
            return resp.status(404).json({ mensaje: "Parte Medico no encontrado" });
        }
        resp.status(200).json(ParteMedico);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const ParteMedicoActualizado = await ParteMedico.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!ParteMedicoActualizado) {
            return resp.status(404).json({ mensaje: "Parte Medico no encontrado" });
        }

        resp.status(200).json(ParteMedicoActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const ParteMedicoEliminado = await ParteMedico.findByIdAndDelete(req.params.id);

        if (!ParteMedicoEliminado) {
            return resp.status(404).json({ mensaje: "Parte Medico no encontrado" });
        }

        resp.status(200).json({ mensaje: "Parte Medico eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
