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

//añadiendo un get por id para que funcione el edit
router.get('/:id', async (req, resp) => {
    try {
        const favorita = await Favorita.findById(req.params.id);

        if (!favorita) {
            return resp.status(404).json({ mensaje: "Favorita no encontrada" });
        }

        resp.status(200).json(favorita);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});
//fin del anadido

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
