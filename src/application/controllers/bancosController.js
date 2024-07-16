const bancoCtrl = {};
const Banco = require('../../core/bancos/models/bancosModel');
const Contabilidad = require('../../core/contabilidad/models/contabilidadModel');

// Renderizar formulario para crear un nuevo banco
bancoCtrl.renderBancoForm = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const bancos = await Banco.find({ contabilidad: contabilidadActiva._id });
    res.render('bancos/new-bank', { bancos });
};

// Crear un nuevo banco
bancoCtrl.createBanco = async (req, res) => {
    const { name, initialBalance = 0, displayOrderOption, afterBank } = req.body;
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    let displayOrder;

    if (displayOrderOption === 'Primero') {
        displayOrder = 1;
        await Banco.updateMany({ contabilidad: contabilidadActiva._id }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastBank = await Banco.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        displayOrder = lastBank ? lastBank.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const bankId = displayOrderOption.split(' ')[2];
        const bankAfter = await Banco.findById(bankId);
        displayOrder = bankAfter.displayOrder + 1;
        await Banco.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: bankAfter.displayOrder } }, { $inc: { displayOrder: 1 } });
    }

    const newBanco = new Banco({ name, initialBalance, displayOrder, contabilidad: contabilidadActiva._id });
    await newBanco.save();
    req.flash('success_msg', 'Banco creado exitosamente');
    res.redirect('/bancos');
};

// Renderizar todos los bancos de la contabilidad activa
bancoCtrl.renderBancos = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const bancos = await Banco.find({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: 'asc' });
    res.render('bancos/todos-los-bancos', { bancos });
};

// Renderizar formulario de edición de banco
bancoCtrl.renderEditForm = async (req, res) => {
    const banco = await Banco.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const bancos = await Banco.find({ contabilidad: contabilidadActiva._id });
    res.render('bancos/edit-bank', { banco, bancos });
};

// Actualizar banco
bancoCtrl.updateBanco = async (req, res) => {
    const { name, initialBalance = 0, displayOrderOption, afterBank } = req.body;
    const banco = await Banco.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    if (displayOrderOption === 'Primero') {
        const currentOrder = banco.displayOrder;
        banco.displayOrder = 1;
        await Banco.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastBank = await Banco.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        banco.displayOrder = lastBank ? lastBank.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const bankId = displayOrderOption.split(' ')[2];
        const bankAfter = await Banco.findById(bankId);
        const currentOrder = banco.displayOrder;
        banco.displayOrder = bankAfter.displayOrder + 1;
        await Banco.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: bankAfter.displayOrder, $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    }

    banco.name = name;
    banco.initialBalance = initialBalance;

    await banco.save();
    req.flash('success_msg', 'Banco actualizado exitosamente');
    res.redirect('/bancos');
};

// Eliminar banco
bancoCtrl.deleteBanco = async (req, res) => {
    const banco = await Banco.findById(req.params.id);

    if (!banco) {
        req.flash('error_msg', 'Banco no encontrado.');
        return res.redirect('/bancos');
    }

    await Banco.updateMany({ contabilidad: banco.contabilidad, displayOrder: { $gt: banco.displayOrder } }, { $inc: { displayOrder: -1 } });

    await Banco.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Banco eliminado exitosamente');
    res.redirect('/bancos');
};

module.exports = bancoCtrl;
