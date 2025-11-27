const express = require('express');
const router = express.Router();
const PeticionAdopcion = require('../models/peticionadopcion');

// Obtener todas las peticiones
router.get('/', async (req, res) => {
    try {
        const data = await PeticionAdopcion.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nueva petición
router.post('/', async (req, res) => {
    try {
        const nueva = new PeticionAdopcion(req.body);
        await nueva.save();
        res.json(nueva);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener una petición por ID
router.get('/:id', async (req, res) => {
    try {
        const data = await PeticionAdopcion.findOne({ idPeticion: req.params.id });
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: 'No encontrada' });
    }
});
//añadiendo un get por id para que funcione el edit
router.get('/:id', async (req, resp) => {
    try {
        const peticionadopcion = await PeticionAdopcion.findById(req.params.id);

        if (!peticionadopcion) {
            return resp.status(404).json({ mensaje: "Peticion de adopcion no encontrado" });
        }

        resp.status(200).json(peticionadopcion);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});
//fin del anadido
// Actualizar una petición
router.put('/:id', async (req, res) => {
    try {
        const data = await PeticionAdopcion.findOneAndUpdate(
            { idPeticion: req.params.id },
            req.body,
            { new: true }
        );
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar una petición
router.delete('/:id', async (req, res) => {
    try {
        await PeticionAdopcion.findOneAndDelete({ idPeticion: req.params.id });
        res.json({ message: 'Eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
