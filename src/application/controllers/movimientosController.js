const movimientoCtrl = {};
const Movimiento = require('../../core/movimientos/models/movimientosModel');
const Banco = require('../../core/bancos/models/bancosModel');
const Category = require('../../core/categorias/models/categoriasModel');
const Etiqueta = require('../../core/etiquetas/models/etiquetasModel');
const Tercero = require('../../core/terceros/models/tercerosModel');
const Contabilidad = require('../../core/contabilidad/models/contabilidadModel');

// Renderizar formulario para crear un nuevo movimiento
movimientoCtrl.renderMovimientoForm = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    const bancos = await Banco.find({ contabilidad: contabilidadActiva._id });
    const categorias = await Category.find({ contabilidad: contabilidadActiva._id });
    const etiquetas = await Etiqueta.find({ contabilidad: contabilidadActiva._id });
    const terceros = await Tercero.find({ contabilidad: contabilidadActiva._id });

    res.render('movimientos/new-mov', { bancos, categorias, etiquetas, terceros });
};

// Crear un nuevo movimiento
movimientoCtrl.createMovimiento = async (req, res) => {
    const { monto, tipoMonto, fecha, descripcion, banco, categoria, etiqueta, tercero } = req.body;
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    const newMovimiento = new Movimiento({
        monto,
        tipoMonto,
        fecha,
        descripcion,
        banco,
        categoria,
        etiqueta,
        tercero,
        contabilidad: contabilidadActiva._id
    });

    await newMovimiento.save();
    req.flash('success_msg', 'Movimiento creado exitosamente');
    res.redirect('/movimientos');
};

// Renderizar todos los movimientos de la contabilidad activa
movimientoCtrl.renderMovimientos = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    const movimientos = await Movimiento.find({ contabilidad: contabilidadActiva._id }).sort({ fecha: 'desc' });
    res.render('movimientos/todos-los-movimientos', { movimientos });
};

// Renderizar formulario de edición de movimiento
movimientoCtrl.renderEditForm = async (req, res) => {
    const movimiento = await Movimiento.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    const bancos = await Banco.find({ contabilidad: contabilidadActiva._id });
    const categorias = await Category.find({ contabilidad: contabilidadActiva._id });
    const etiquetas = await Etiqueta.find({ contabilidad: contabilidadActiva._id });
    const terceros = await Tercero.find({ contabilidad: contabilidadActiva._id });

    res.render('movimientos/edit-mov', { movimiento, bancos, categorias, etiquetas, terceros });
};

// Actualizar movimiento
movimientoCtrl.updateMovimiento = async (req, res) => {
    const { monto, tipoMonto, fecha, descripcion, banco, categoria, etiqueta, tercero } = req.body;
    const movimiento = await Movimiento.findById(req.params.id);

    if (!movimiento) {
        req.flash('error_msg', 'Movimiento no encontrado.');
        return res.redirect('/movimientos');
    }

    movimiento.monto = monto;
    movimiento.tipoMonto = tipoMonto;
    movimiento.fecha = fecha;
    movimiento.descripcion = descripcion;
    movimiento.banco = banco;
    movimiento.categoria = categoria;
    movimiento.etiqueta = etiqueta;
    movimiento.tercero = tercero;

    await movimiento.save();
    req.flash('success_msg', 'Movimiento actualizado exitosamente');
    res.redirect('/movimientos');
};

// Eliminar movimiento
movimientoCtrl.deleteMovimiento = async (req, res) => {
    await Movimiento.findByIdAndDelete(req.params.id);
    req.flash('success', 'Movimiento eliminado exitosamente');
    res.redirect('/movimientos');
};

// Renderizar el control diario
movimientoCtrl.renderControlDiario = async (req, res) => {
    const contabilidad = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidad) {
        req.flash('error', 'No hay contabilidad activa.');
        return res.redirect('/contabilidades');
    }

    const movimientos = await Movimiento.find({ contabilidad: contabilidad._id })
        .populate('categoria')
        .populate('banco')
        .populate('etiqueta')
        .populate('tercero')
        .sort({ fecha: 'asc' });

    // Calcular el balance total incluyendo los saldos iniciales de los bancos
    const bancos = await Banco.find({ contabilidad: contabilidad._id });
    let balanceTotal = bancos.reduce((acc, banco) => acc + banco.initialBalance, 0);

    movimientos.forEach(movimiento => {
        if (movimiento.tipoMonto === 'Ingreso') {
            balanceTotal += movimiento.monto;
        } else if (movimiento.tipoMonto === 'Gasto') {
            balanceTotal -= movimiento.monto;
        }
        movimiento.balanceTotal = balanceTotal;
    });

    res.render('movimientos/control-diario', { movimientos });
};

module.exports = movimientoCtrl;
