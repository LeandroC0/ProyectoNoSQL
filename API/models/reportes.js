const mongoose = require('mongoose');

const ReporteSchema = new mongoose.Schema(
    {
        idReporte: { type: String, required: true },
        usuarioReporta: { type: String, required: true },
        usuarioDenunciado: { type: String },
        mascota: { type: String },
        tipo: { type: String, enum: ['Maltrato', 'Fraude'], required: true },
        descripcion: { type: String, required: true },
        evidenciaUrl: { type: String },
        estado: { type: String, default: 'En revisión' },
        fecha: { type: String, required: true }
    },
    { collection: 'reportes' }
);

module.exports = mongoose.model('Reporte', ReporteSchema);
