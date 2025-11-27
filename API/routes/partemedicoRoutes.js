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

    const nuevoParte = new ParteMedico({
        idHistorial,
        mascota,
        fecha,
        veterinario,
        diagnostico,
        tratamiento,
        proximaCita
    });

    try {
        const guardado = await nuevoParte.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// READ - ALL
// ============================
route.get('/', async (req, resp) => {
    try {
        const lista = await ParteMedico.find();
        resp.status(200).json(lista);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// READ - BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const historial = await ParteMedico.findOne({
            idHistorial: req.params.id
        });

        if (!historial) {
            return resp.status(404).json({ mensaje: "Parte médico no encontrado" });
        }

        resp.status(200).json(historial);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await ParteMedico.findOneAndUpdate(
            { idHistorial: req.params.id },
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Parte médico no encontrado" });
        }

        resp.status(200).json(actualizado);

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await ParteMedico.findOneAndDelete({
            idHistorial: req.params.id
        });

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Parte médico no encontrado" });
        }

        resp.status(200).json({ mensaje: "Parte médico eliminado correctamente" });

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
