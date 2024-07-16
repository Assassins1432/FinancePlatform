const contCtrl = {};
const Contabilidad = require('../../core/contabilidad/models/contabilidadModel');

// Función de validación
const validateContabilidad = (name, description) => {
    const errors = [];
    if (!name || !description) {
        errors.push({ text: 'Por favor completa todos los campos.' });
    }
    if (name.length < 3) {
        errors.push({ text: 'El nombre debe tener al menos 3 caracteres.' });
    }
    if (description.length < 5) {
        errors.push({ text: 'La descripción debe tener al menos 5 caracteres.' });
    }
    return errors;
};

// Renderizar formulario para crear una nueva contabilidad
contCtrl.renderContabilidadForm = (req, res) => {
    res.render('contabilidades/new-cont');
};

// Crear una nueva contabilidad
contCtrl.createContabilidad = async (req, res) => {
    const { name, description } = req.body;
    const errors = validateContabilidad(name, description);

    // Validación: Verificar si hay errores
    if (errors.length > 0) {
        req.session.messages = errors.map(err => ({ type: 'error', message: err.text }));
        return res.redirect('/contabilidades/add');
    }

    // Validación: Verificar si el nombre ya existe para este usuario
    const existingContabilidad = await Contabilidad.findOne({ name, user: req.user.id });
    if (existingContabilidad) {
        req.flash('error', 'Ya tienes una contabilidad con ese nombre.');
        return res.redirect('/contabilidades/add');
    }

    const newContabilidad = new Contabilidad({ name, description, user: req.user.id });
    await newContabilidad.save();
    req.flash('success', 'Contabilidad creada exitosamente');
    res.redirect('/contabilidades');
};

// Renderizar todas las contabilidades del usuario
contCtrl.renderContabilidades = async (req, res) => {
    const contabilidades = await Contabilidad.find({ user: req.user.id }).sort({ createdAt: 'asc' });
    res.render('contabilidades/todas-las-contabilidades', { contabilidades });
};

// Renderizar formulario de edición de contabilidad
contCtrl.renderEditForm = async (req, res) => {
    const contabilidad = await Contabilidad.findById(req.params.id);
    if (contabilidad.user.toString() !== req.user.id) {
        req.flash('error', 'No autorizado');
        return res.redirect('/contabilidades');
    }
    res.render('contabilidades/edit-cont', { contabilidad });
};

// Actualizar contabilidad
contCtrl.updateContabilidad = async (req, res) => {
    const { name, description } = req.body;
    const errors = validateContabilidad(name, description);
    const contabilidad = await Contabilidad.findById(req.params.id);

    if (errors.length > 0) {
        req.session.messages = errors.map(err => ({ type: 'error', message: err.text }));
        return res.redirect(`/contabilidades/edit/${req.params.id}`);
    }

    if (contabilidad.user.toString() !== req.user.id) {
        req.flash('error', 'No autorizado');
        return res.redirect('/contabilidades');
    }

    // Validación: Verificar si el nombre ya existe para este usuario (excluyendo la contabilidad actual)
    const existingContabilidad = await Contabilidad.findOne({ name, user: req.user.id, _id: { $ne: req.params.id } });
    if (existingContabilidad) {
        req.flash('error', 'Ya tienes una contabilidad con ese nombre.');
        return res.redirect(`/contabilidades/edit/${req.params.id}`);
    }

    await Contabilidad.findByIdAndUpdate(req.params.id, { name, description });
    req.flash('success', 'Contabilidad actualizada exitosamente');
    res.redirect('/contabilidades');
};

// Eliminar contabilidad
contCtrl.deleteContabilidad = async (req, res) => {
    const contabilidad = await Contabilidad.findById(req.params.id);

    if (contabilidad.user.toString() !== req.user.id) {
        req.flash('error_msg', 'No autorizado');
        return res.redirect('/contabilidades');
    }

    await Contabilidad.findByIdAndDelete(contabilidad._id); // Usamos .findByIdAndDelete() para que se dispare el middleware pre('findOneAndDelete')
    req.flash('success_msg', 'Contabilidad eliminada exitosamente');
    res.redirect('/contabilidades');
};

// Activar contabilidad
contCtrl.activateContabilidad = async (req, res) => {
    const userId = req.user.id;
    const contabilidadId = req.params.id;

    // Desactivar otras contabilidades del usuario
    await Contabilidad.updateMany({ user: userId, isActive: true }, { isActive: false });

    // Activar la contabilidad seleccionada
    await Contabilidad.findByIdAndUpdate(contabilidadId, { isActive: true });

    req.flash('success', 'Contabilidad activada exitosamente');
    res.redirect('/contabilidades');
};

module.exports = contCtrl;
