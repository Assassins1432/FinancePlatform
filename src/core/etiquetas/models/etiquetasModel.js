const mongoose = require('mongoose');

const etiquetaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    displayOrder: {
        type: Number,
        required: true
    },
    contabilidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contabilidad',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Etiqueta', etiquetaSchema);
