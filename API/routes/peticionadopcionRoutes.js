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

    const nuevaPeticion = new PeticionAdopcion({
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
        const guardado = await nuevaPeticion.save();
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
        const peticiones = await PeticionAdopcion.find();
        resp.status(200).json(peticiones);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// READ - BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const peticion = await PeticionAdopcion.findOne({
            idPeticion: req.params.id
        });

        if (!peticion) {
            return resp.status(404).json({ mensaje: "Petición de adopción no encontrada" });
        }

        resp.status(200).json(peticion);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const peticionActualizada = await PeticionAdopcion.findOneAndUpdate(
            { idPeticion: req.params.id },
            req.body,
            { new: true }
        );

        if (!peticionActualizada) {
            return resp.status(404).json({ mensaje: "Petición de adopción no encontrada" });
        }

        resp.status(200).json(peticionActualizada);

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const eliminada = await PeticionAdopcion.findOneAndDelete({
            idPeticion: req.params.id
        });

        if (!eliminada) {
            return resp.status(404).json({ mensaje: "Petición de adopción no encontrada" });
        }

        resp.status(200).json({ mensaje: "Petición de adopción eliminada correctamente" });

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
