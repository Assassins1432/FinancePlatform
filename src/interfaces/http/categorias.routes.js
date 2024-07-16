const express = require('express');
const router = express.Router();
const categoryCtrl = require('../../application/controllers/categoriasController');
const authMiddleware = require('../../infrastructure/http/middlewares/authMiddleware');

// Renderizar formulario para crear una nueva categoría
router.get('/categorias/add', authMiddleware, categoryCtrl.renderCategoryForm);

// Crear una nueva categoría
router.post('/categorias/new-cat', authMiddleware, categoryCtrl.createCategory);

// Renderizar todas las categorías de la contabilidad activa
router.get('/categorias', authMiddleware, categoryCtrl.renderCategories);

// Renderizar formulario de edición de categoría
router.get('/categorias/edit/:id', authMiddleware, categoryCtrl.renderEditForm);

// Actualizar categoría
router.put('/categorias/edit/:id', authMiddleware, categoryCtrl.updateCategory);

// Eliminar categoría
router.delete('/categorias/delete/:id', authMiddleware, categoryCtrl.deleteCategory);

module.exports = router;
