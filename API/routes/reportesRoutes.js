const express = require('express');
const route = express.Router();
const Reporte = require('../models/reportes');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    try {
        const nuevoReporte = new Reporte(req.body);
        const guardado = await nuevoReporte.save();
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
        const reportes = await Reporte.find();
        resp.status(200).json(reportes);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ - BY ID (USANDO _id REAL DE MONGO)
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const reporte = await Reporte.findById(req.params.id);
        if (!reporte) {
            return resp.status(404).json({ mensaje: "Reporte no encontrado" });
        }
        resp.status(200).json(reporte);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const reporteActualizado = await Reporte.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!reporteActualizado) {
            return resp.status(404).json({ mensaje: "Reporte no encontrado" });
        }
        resp.status(200).json(reporteActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await Reporte.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Reporte no encontrado" });
        }
        resp.status(200).json({ mensaje: "Reporte eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
