const express = require('express');
const router = express.Router();
const authMiddleware = require('../../infrastructure/http/middlewares/authMiddleware');


const {
    renderContabilidades,
    renderContabilidadForm,
    createContabilidad,
    deleteContabilidad,
    renderEditForm,
    updateContabilidad,
    activateContabilidad} = require('../../application/controllers/contabilidadController');

// Obtener todas las contabilidades
router.get('/contabilidades', authMiddleware ,renderContabilidades);

// Nueva contabilidad
router.get('/contabilidades/add', authMiddleware, renderContabilidadForm);
router.post('/contabilidades/new-cont', authMiddleware, createContabilidad);

// Editar una contabilidad
router.get('/contabilidades/edit/:id', authMiddleware, renderEditForm);
router.put('/contabilidades/edit-cont/:id', authMiddleware, updateContabilidad);

// Eliminar una contabilidad
router.delete('/contabilidades/delete/:id', authMiddleware, deleteContabilidad);

// Activar una contabilidad
router.post('/contabilidades/activate/:id', authMiddleware, activateContabilidad);

module.exports = router;