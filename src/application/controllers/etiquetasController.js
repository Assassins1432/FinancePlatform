const etiquetaCtrl = {};
const Etiqueta = require('../../core/etiquetas/models/etiquetasModel');
const Contabilidad = require('../../core/contabilidad/models/contabilidadModel');

// Renderizar formulario para crear una nueva etiqueta
etiquetaCtrl.renderEtiquetaForm = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const etiquetas = await Etiqueta.find({ contabilidad: contabilidadActiva._id });
    res.render('etiquetas/new-etiq', { etiquetas });
};

// Crear una nueva etiqueta
etiquetaCtrl.createEtiqueta = async (req, res) => {
    const { name, displayOrderOption } = req.body;
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    let displayOrder;

    if (displayOrderOption === 'Primero') {
        displayOrder = 1;
        await Etiqueta.updateMany({ contabilidad: contabilidadActiva._id }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastEtiqueta = await Etiqueta.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        displayOrder = lastEtiqueta ? lastEtiqueta.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const etiquetaId = displayOrderOption.split(' ')[2];
        const etiquetaAfter = await Etiqueta.findById(etiquetaId);
        displayOrder = etiquetaAfter.displayOrder + 1;
        await Etiqueta.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: etiquetaAfter.displayOrder } }, { $inc: { displayOrder: 1 } });
    }

    const newEtiqueta = new Etiqueta({ name, displayOrder, contabilidad: contabilidadActiva._id });
    await newEtiqueta.save();
    req.flash('success_msg', 'Etiqueta creada exitosamente');
    res.redirect('/etiquetas');
};

// Renderizar todas las etiquetas de la contabilidad activa
etiquetaCtrl.renderEtiquetas = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const etiquetas = await Etiqueta.find({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: 'asc' });
    res.render('etiquetas/todas-las-etiquetas', { etiquetas });
};

// Renderizar formulario de edición de etiqueta
etiquetaCtrl.renderEditForm = async (req, res) => {
    const etiqueta = await Etiqueta.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const etiquetas = await Etiqueta.find({ contabilidad: contabilidadActiva._id });
    res.render('etiquetas/edit-etiq', { etiqueta, etiquetas });
};

// Actualizar etiqueta
etiquetaCtrl.updateEtiqueta = async (req, res) => {
    const { name, displayOrderOption } = req.body;
    const etiqueta = await Etiqueta.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    if (displayOrderOption === 'Primero') {
        const currentOrder = etiqueta.displayOrder;
        etiqueta.displayOrder = 1;
        await Etiqueta.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastEtiqueta = await Etiqueta.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        etiqueta.displayOrder = lastEtiqueta ? lastEtiqueta.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const etiquetaId = displayOrderOption.split(' ')[2];
        const etiquetaAfter = await Etiqueta.findById(etiquetaId);
        const currentOrder = etiqueta.displayOrder;
        etiqueta.displayOrder = etiquetaAfter.displayOrder + 1;
        await Etiqueta.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: etiquetaAfter.displayOrder, $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    }

    etiqueta.name = name;

    await etiqueta.save();
    req.flash('success_msg', 'Etiqueta actualizada exitosamente');
    res.redirect('/etiquetas');
};

// Eliminar etiqueta
etiquetaCtrl.deleteEtiqueta = async (req, res) => {
    const etiqueta = await Etiqueta.findById(req.params.id);

    if (!etiqueta) {
        req.flash('error_msg', 'Etiqueta no encontrada.');
        return res.redirect('/etiquetas');
    }

    await Etiqueta.updateMany({ contabilidad: etiqueta.contabilidad, displayOrder: { $gt: etiqueta.displayOrder } }, { $inc: { displayOrder: -1 } });

    await Etiqueta.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Etiqueta eliminada exitosamente');
    res.redirect('/etiquetas');
};

module.exports = etiquetaCtrl;
