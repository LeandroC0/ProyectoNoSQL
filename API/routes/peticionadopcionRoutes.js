const express = require('express');
const route = express.Router();
const PeticionAdopcion = require('../models/peticionadopcion');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const {
        idPeticion,
        usuario,
        mascota,
        refugio,
        estado,
        fechaPeticion,
        fechaRespuesta,
        notasRefugio
    } = req.body;

    const nuevoPeticionAdopcion = new PeticionAdopcion({
        idPeticion,
        usuario,
        mascota,
        refugio,
        estado,
        fechaPeticion,
        fechaRespuesta,
        notasRefugio
    });

    try {
        const guardado = await nuevoPeticionAdopcion.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ ALL
// ============================
route.get('/', async (req, resp) => {
    try {
        const lista = await PeticionAdopcion.find();
        resp.status(200).json(lista);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const peticion = await PeticionAdopcion.findById(req.params.id);
        if (!peticion) {
            return resp.status(404).json({ mensaje: "Petición de adopción no encontrada" });
        }
        resp.status(200).json(peticion);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await PeticionAdopcion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Petición de adopción no encontrada" });
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
        const eliminado = await PeticionAdopcion.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Petición de adopción no encontrada" });
        }

        resp.status(200).json({ mensaje: "Eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
