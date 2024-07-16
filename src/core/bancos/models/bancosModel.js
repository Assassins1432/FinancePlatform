const mongoose = require('mongoose');

const bancoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    initialBalance: {
        type: Number,
        default: 0
    },
    displayOrder: {
        type: Number,
        required: true
    },
    contabilidad: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Contabilidad',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Banco', bancoSchema);
