const express = require('express');
const route = express.Router();

const Reportes = require('../models/reportes');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        idReporte,
        usuarioReporta,
        usuarioDenunciado,
        mascota,
        tipo,
        descripcion,
        evidenciaUrl,
        estado,
        fecha
    } = req.body;

    const nuevoReportes = new Reportes({
        idReporte,
        usuarioReporta,
        usuarioDenunciado,
        mascota,
        tipo,
        descripcion,
        evidenciaUrl,
        estado,
        fecha
    });

    try {
        const reportesGuardado = await nuevoReportes.save();
        resp.status(201).json(reportesGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const reportes = await Reportes.find();
        resp.status(200).json(reportes);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const reporte = await Reportes.findById(req.params.id);
        if (!reporte) {
            return resp.status(404).json({ mensaje: "Reporte no encontrado" });
        }
        resp.status(200).json(reporte);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const reporteActualizado = await Reportes.findByIdAndUpdate(
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
        const reporteEliminado = await Reportes.findByIdAndDelete(req.params.id);

        if (!reporteEliminado) {
            return resp.status(404).json({ mensaje: "Reporte no encontrado" });
        }

        resp.status(200).json({ mensaje: "Reporte eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
