const express = require('express');
const router = express.Router();
const ParteMedico = require('../models/partemedico');

router.get('/', async (req, res) => {
    try {
        res.json(await ParteMedico.find());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevo = new ParteMedico(req.body);
        await nuevo.save();
        res.json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await ParteMedico.findOne({ idHistorial: req.params.id }));
    } catch {
        res.status(404).json({ error: 'No encontrado' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        res.json(
            await ParteMedico.findOneAndUpdate(
                { idHistorial: req.params.id },
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
        await ParteMedico.findOneAndDelete({ idHistorial: req.params.id });
        res.json({ message: 'Eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
