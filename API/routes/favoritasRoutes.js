const express = require('express');
const route = express.Router();

const Favorita = require('../models/favoritas');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        idFavorito,
        usuario,
        mascota,
        fechaGuardado
    } = req.body;

    const nuevaFavorita = new Favorita({
        idFavorito,
        usuario,
        mascota,
        fechaGuardado
    });

    try {
        const favoritoGuardado = await nuevaFavorita.save();
        resp.status(201).json(favoritoGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// READ - ALL
// ============================
route.get('/', async (req, resp) => {
    try {
        const favoritas = await Favorita.find();
        resp.status(200).json(favoritas);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// READ - BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const favorita = await Favorita.findOne({ idFavorito: req.params.id });

        if (!favorita) {
            return resp.status(404).json({ mensaje: "Favorita no encontrada" });
        }

        resp.status(200).json(favorita);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
// route.put('/:id', async (req, resp) => {
//     try {
//         const favoritaActualizada = await Favorita.findOneAndUpdate(
//             { idFavorito: req.params.id },
//             req.body,
//             { new: true }
//         );

//         if (!favoritaActualizada) {
//             return resp.status(404).json({ mensaje: "Favorita no encontrada" });
//         }

//         resp.status(200).json(favoritaActualizada);

//     } catch (error) {
//         resp.status(400).json({ mensaje: error.message });
//     }
// });



route.put('/:id', async (req, resp) => {
    try {
        const favoritaActualizada = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!favoritaActualizada) {
            return resp.status(404).json({ mensaje: "Favorita no encontrada" });
        }

        resp.status(200).json(favoritaActualizada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// DELETE
// ============================



// route.delete('/:id', async (req, resp) => {
//     try {
//         const favoritaEliminada = await Favorita.findOneAndDelete({
//             idFavorito: req.params.id
//         });

//         if (!favoritaEliminada) {
//             return resp.status(404).json({ mensaje: "Favorita no encontrada" });
//         }

//         resp.status(200).json({ mensaje: "Favorita eliminada correctamente" });

//     } catch (error) {
//         resp.status(400).json({ mensaje: error.message });
//     }
// });

//module.exports = route;



route.delete('/:id', async (req, resp) => {
    try {
        const favoritaEliminada = await Usuario.findByIdAndDelete(req.params.id);

        if (!favoritaEliminada) {
            return resp.status(404).json({ mensaje: "Favorita no encontrada" });
        }

        resp.status(200).json({ mensaje: "Favorita eliminada correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
