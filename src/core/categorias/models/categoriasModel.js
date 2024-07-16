const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: {
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
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
