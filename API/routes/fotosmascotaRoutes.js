const express = require('express');
const router = express.Router();
const FotoMascota = require('../models/fotosmascota');

router.get('/', async (req, res) => {
    try {
        res.json(await FotoMascota.find());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nueva = new FotoMascota(req.body);
        await nueva.save();
        res.json(nueva);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await FotoMascota.findOne({ idFoto: req.params.id }));
    } catch {
        res.status(404).json({ error: 'No encontrado' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        res.json(
            await FotoMascota.findOneAndUpdate(
                { idFoto: req.params.id },
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
        await FotoMascota.findOneAndDelete({ idFoto: req.params.id });
        res.json({ message: 'Eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
