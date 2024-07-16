const express = require('express');
const router = express.Router();
const authMiddleware = require('../../infrastructure/http/middlewares/authMiddleware');

const {
    renderEtiquetaForm,
    createEtiqueta,
    renderEtiquetas,
    renderEditForm,
    updateEtiqueta,
    deleteEtiqueta
} = require('../../application/controllers/etiquetasController');

// Nueva etiqueta
router.get('/etiquetas/add', authMiddleware, renderEtiquetaForm);
router.post('/etiquetas/new-etiq', authMiddleware, createEtiqueta);

// Listar etiquetas
router.get('/etiquetas', authMiddleware, renderEtiquetas);

// Editar etiqueta
router.get('/etiquetas/edit/:id', authMiddleware, renderEditForm);
router.put('/etiquetas/edit-etiq/:id', authMiddleware, updateEtiqueta);

// Eliminar etiqueta
router.delete('/etiquetas/delete/:id', authMiddleware, deleteEtiqueta);

module.exports = router;
