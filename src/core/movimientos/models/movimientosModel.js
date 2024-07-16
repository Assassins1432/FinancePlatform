const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
    monto: {
        type: Number,
        required: true
    },
    tipoMonto: {
        type: String,
        enum: ['Gasto', 'Ingreso', 'Traspaso'],
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    descripcion: {
        type: String,
        required: true
    },
    banco: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Banco'
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    etiqueta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Etiqueta'
    },
    tercero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tercero'
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

module.exports = mongoose.model('Movimiento', movimientoSchema);
