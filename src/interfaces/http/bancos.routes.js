const express = require('express');
const router = express.Router();

const { renderBancoForm, createBanco, renderBancos, renderEditForm, updateBanco, deleteBanco } = require('../../application/controllers/bancosController');
const authMiddleware = require('../../infrastructure/http/middlewares/authMiddleware');

// Nuevo banco
router.get('/bancos/add', authMiddleware, renderBancoForm);
router.post('/bancos/new-bank', authMiddleware, createBanco);

// Mostrar todos los bancos
router.get('/bancos', authMiddleware, renderBancos);

// Editar banco
router.get('/bancos/edit/:id', authMiddleware, renderEditForm);
router.put('/bancos/edit-bank/:id', authMiddleware, updateBanco);

// Eliminar banco
router.delete('/bancos/delete/:id', authMiddleware, deleteBanco);

module.exports = router;