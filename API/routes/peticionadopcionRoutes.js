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
        const peticionesadopcionGuardado = await nuevoPeticionAdopcion.save();
        resp.status(201).json(peticionesadopcionGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const peticionesadopcion = await PeticionAdopcion.find();
        resp.status(200).json(peticionesadopcion);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const peticionadopcion = await PeticionAdopcion.findById(req.params.id);
        if (!peticionadopcion) {
            return resp.status(404).json({ mensaje: "Peticion de Adopcion no encontrado" });
        }
        resp.status(200).json(peticionadopcion);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const peticionesadopcionActualizado = await PeticionAdopcion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!peticionesadopcionActualizado) {
            return resp.status(404).json({ mensaje: "PeticionAdopcion no encontrado" });
        }

        resp.status(200).json(peticionesadopcionActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const peticionesadopcionEliminado = await PeticionAdopcion.findByIdAndDelete(req.params.id);

        if (!peticionesadopcionEliminado) {
            return resp.status(404).json({ mensaje: "Peticion de Adopcion no encontrado" });
        }

        resp.status(200).json({ mensaje: "Peticion de Adopcion eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
