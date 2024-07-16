const express = require('express');
const router = express.Router();
const authMiddleware = require('../../infrastructure/http/middlewares/authMiddleware');

const {
    renderTerceroForm,
    createTercero,
    renderTerceros,
    renderEditForm,
    updateTercero,
    deleteTercero
} = require('../../application/controllers/tercerosController');

// Nuevo tercero
router.get('/terceros/add', authMiddleware, renderTerceroForm);
router.post('/terceros/new-ter', authMiddleware, createTercero);

// Listar terceros
router.get('/terceros', authMiddleware, renderTerceros);

// Editar tercero
router.get('/terceros/edit/:id', authMiddleware, renderEditForm);
router.put('/terceros/edit-ter/:id', authMiddleware, updateTercero);

// Eliminar tercero
router.delete('/terceros/delete/:id', authMiddleware, deleteTercero);

module.exports = router;
