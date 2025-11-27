const express = require('express');
const router = express.Router();
const Reporte = require('../models/reportes');

router.get('/', async (req, res) => {
    try {
        res.json(await Reporte.find());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevo = new Reporte(req.body);
        await nuevo.save();
        res.json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await Reporte.findOne({ idReporte: req.params.id }));
    } catch {
        res.status(404).json({ error: 'No encontrado' });
    }
});
//añadiendo un get por id para que funcione el edit
router.get('/:id', async (req, resp) => {
    try {
        const reportes = await Reporte.findById(req.params.id);

        if (!reportes) {
            return resp.status(404).json({ mensaje: "Reporte no encontrado" });
        }

        resp.status(200).json(reportes);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});
//fin del anadido

router.put('/:id', async (req, res) => {
    try {
        res.json(
            await Reporte.findOneAndUpdate(
                { idReporte: req.params.id },
                req.body,
                { new: true }
            )
        );
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Reporte.findOneAndDelete({ idReporte: req.params.id });
        res.json({ message: 'Eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
