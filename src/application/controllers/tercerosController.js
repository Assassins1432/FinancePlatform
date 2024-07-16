const terceroCtrl = {};
const Tercero = require('../../core/terceros/models/tercerosModel');
const Contabilidad = require('../../core/contabilidad/models/contabilidadModel');

// Renderizar formulario para crear un nuevo tercero
terceroCtrl.renderTerceroForm = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const terceros = await Tercero.find({ contabilidad: contabilidadActiva._id });
    res.render('terceros/new-ter', { terceros });
};

// Crear un nuevo tercero
terceroCtrl.createTercero = async (req, res) => {
    const { name, displayOrderOption } = req.body;
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    let displayOrder;

    if (displayOrderOption === 'Primero') {
        displayOrder = 1;
        await Tercero.updateMany({ contabilidad: contabilidadActiva._id }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastTercero = await Tercero.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        displayOrder = lastTercero ? lastTercero.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const terceroId = displayOrderOption.split(' ')[2];
        const terceroAfter = await Tercero.findById(terceroId);
        displayOrder = terceroAfter.displayOrder + 1;
        await Tercero.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: terceroAfter.displayOrder } }, { $inc: { displayOrder: 1 } });
    }

    const newTercero = new Tercero({ name, displayOrder, contabilidad: contabilidadActiva._id });
    await newTercero.save();
    req.flash('success_msg', 'Tercero creado exitosamente');
    res.redirect('/terceros');
};

// Renderizar todos los terceros de la contabilidad activa
terceroCtrl.renderTerceros = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const terceros = await Tercero.find({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: 'asc' });
    res.render('terceros/todos-los-terceros', { terceros });
};

// Renderizar formulario de edición de tercero
terceroCtrl.renderEditForm = async (req, res) => {
    const tercero = await Tercero.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const terceros = await Tercero.find({ contabilidad: contabilidadActiva._id });
    res.render('terceros/edit-ter', { tercero, terceros });
};

// Actualizar tercero
terceroCtrl.updateTercero = async (req, res) => {
    const { name, displayOrderOption } = req.body;
    const tercero = await Tercero.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    if (displayOrderOption === 'Primero') {
        const currentOrder = tercero.displayOrder;
        tercero.displayOrder = 1;
        await Tercero.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastTercero = await Tercero.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        tercero.displayOrder = lastTercero ? lastTercero.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const terceroId = displayOrderOption.split(' ')[2];
        const terceroAfter = await Tercero.findById(terceroId);
        const currentOrder = tercero.displayOrder;
        tercero.displayOrder = terceroAfter.displayOrder + 1;
        await Tercero.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: terceroAfter.displayOrder, $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    }

    tercero.name = name;

    await tercero.save();
    req.flash('success_msg', 'Tercero actualizado exitosamente');
    res.redirect('/terceros');
};

// Eliminar tercero
terceroCtrl.deleteTercero = async (req, res) => {
    const tercero = await Tercero.findById(req.params.id);

    if (!tercero) {
        req.flash('error_msg', 'Tercero no encontrado.');
        return res.redirect('/terceros');
    }

    await Tercero.updateMany({ contabilidad: tercero.contabilidad, displayOrder: { $gt: tercero.displayOrder } }, { $inc: { displayOrder: -1 } });

    await Tercero.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Tercero eliminado exitosamente');
    res.redirect('/terceros');
};

module.exports = terceroCtrl;
