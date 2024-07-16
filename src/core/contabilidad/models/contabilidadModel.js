const mongoose = require('mongoose');
const Category = require('../../categorias/models/categoriasModel');
const Banco = require('../../bancos/models/bancosModel');
const Etiqueta = require('../../etiquetas/models/etiquetasModel')
const Tercero = require('../../terceros/models/tercerosModel')

const contabilidadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Middleware para eliminar categorías y bancos asociados antes de eliminar una contabilidad
contabilidadSchema.pre('findOneAndDelete', async function(next) {
    try {
        const contabilidad = await this.model.findOne(this.getFilter());
        if (contabilidad) {
            await Category.deleteMany({ contabilidad: contabilidad._id });
            await Banco.deleteMany({ contabilidad: contabilidad._id });
            await Etiqueta.deleteMany({ contabilidad: contabilidad._id });
            await Tercero.deleteMany({ contabilidad: contabilidad._id });
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Contabilidad', contabilidadSchema);