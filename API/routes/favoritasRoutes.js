const express = require('express');
const router = express.Router();
const Favorita = require('../models/Favoritas');

router.get('/', async (req, res) => {
    try {
        res.json(await Favorita.find());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevo = new Favorita(req.body);
        await nuevo.save();
        res.json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await Favorita.findOne({ idFavorito: req.params.id }));
    } catch {
        res.status(404).json({ error: 'No encontrado' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        res.json(await Favorita.findOneAndUpdate(
            { idFavorito: req.params.id },
            req.body,
            { new: true }
        ));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Favorita.findOneAndDelete({ idFavorito: req.params.id });
        res.json({ message: 'Eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
