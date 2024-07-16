const categoryCtrl = {};
const Category = require('../../core/categorias/models/categoriasModel');
const Contabilidad = require('../../core/contabilidad/models/contabilidadModel');

// Renderizar formulario para crear una nueva categoría
categoryCtrl.renderCategoryForm = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const categorias = await Category.find({ contabilidad: contabilidadActiva._id });
    res.render('categorias/new-cat', { categorias });
};

// Crear una nueva categoría
categoryCtrl.createCategory = async (req, res) => {
    const { description, displayOrderOption } = req.body;
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    let displayOrder;

    if (displayOrderOption === 'Primero') {
        displayOrder = 1;
        await Category.updateMany({ contabilidad: contabilidadActiva._id }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastCategory = await Category.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        displayOrder = lastCategory ? lastCategory.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const categoryId = displayOrderOption.split(' ')[2];
        const categoryAfter = await Category.findById(categoryId);
        displayOrder = categoryAfter.displayOrder + 1;
        await Category.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: categoryAfter.displayOrder } }, { $inc: { displayOrder: 1 } });
    }

    const newCategory = new Category({ description, displayOrder, contabilidad: contabilidadActiva._id });
    await newCategory.save();
    req.flash('success_msg', 'Categoría creada exitosamente');
    res.redirect('/categorias');
};

// Renderizar todas las categorías de la contabilidad activa
categoryCtrl.renderCategories = async (req, res) => {
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const categorias = await Category.find({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: 'asc' });
    res.render('categorias/todas-las-categorias', { categorias });
};

// Renderizar formulario de edición de categoría
categoryCtrl.renderEditForm = async (req, res) => {
    const categoria = await Category.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });
    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }
    const categorias = await Category.find({ contabilidad: contabilidadActiva._id });
    res.render('categorias/edit-cat', { categoria, categorias });
};

// Actualizar categoría
categoryCtrl.updateCategory = async (req, res) => {
    const { description, displayOrderOption } = req.body;
    const categoria = await Category.findById(req.params.id);
    const contabilidadActiva = await Contabilidad.findOne({ user: req.user.id, isActive: true });

    if (!contabilidadActiva) {
        req.flash('error_msg', 'No hay una contabilidad activa. Por favor, active una contabilidad primero.');
        return res.redirect('/contabilidades');
    }

    if (displayOrderOption === 'Primero') {
        const currentOrder = categoria.displayOrder;
        categoria.displayOrder = 1;
        await Category.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    } else if (displayOrderOption === 'Último') {
        const lastCategory = await Category.findOne({ contabilidad: contabilidadActiva._id }).sort({ displayOrder: -1 });
        categoria.displayOrder = lastCategory ? lastCategory.displayOrder + 1 : 1;
    } else if (displayOrderOption.startsWith('Después de')) {
        const categoryId = displayOrderOption.split(' ')[2];
        const categoryAfter = await Category.findById(categoryId);
        const currentOrder = categoria.displayOrder;
        categoria.displayOrder = categoryAfter.displayOrder + 1;
        await Category.updateMany({ contabilidad: contabilidadActiva._id, displayOrder: { $gt: categoryAfter.displayOrder, $lt: currentOrder } }, { $inc: { displayOrder: 1 } });
    }

    categoria.description = description;

    await categoria.save();
    req.flash('success_msg', 'Categoría actualizada exitosamente');
    res.redirect('/categorias');
};

// Eliminar categoría
categoryCtrl.deleteCategory = async (req, res) => {
    const categoria = await Category.findById(req.params.id);

    if (!categoria) {
        req.flash('error_msg', 'Categoría no encontrada.');
        return res.redirect('/categorias');
    }

    await Category.updateMany({ contabilidad: categoria.contabilidad, displayOrder: { $gt: categoria.displayOrder } }, { $inc: { displayOrder: -1 } });

    await Category.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Categoría eliminada exitosamente');
    res.redirect('/categorias');
};

module.exports = categoryCtrl;
