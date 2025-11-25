const express = require('express');
const route = express.Router();

const Usuario = require('../models/usuarios');

// ============================
// CREATE
// ============================
route.post('/', async (req, resp) => {
    const { 
        nombre,
        correo,
        telefono,
        direccion,
        rol,
        fechaRegistro
    } = req.body;

    const nuevoUsuario = new Usuario({
        nombre,
        correo,
        telefono,
        direccion,
        rol,
        fechaRegistro
    });

    try {
        const usuarioGuardado = await nuevoUsuario.save();
        resp.status(201).json(usuarioGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// READ
// ============================
route.get('/', async (req, resp) => {
    try {
        const usuarios = await Usuario.find();
        resp.status(200).json(usuarios);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// ============================
// READ BY ID
// ============================
route.get('/:id', async (req, resp) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        resp.status(200).json(usuario);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// ============================
// UPDATE
// ============================
route.put('/:id', async (req, resp) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!usuarioActualizado) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.status(200).json(usuarioActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// ============================
// DELETE
// ============================
route.delete('/:id', async (req, resp) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
