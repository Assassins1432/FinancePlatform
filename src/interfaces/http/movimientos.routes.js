const express = require('express');
const router = express.Router();
const authMiddleware = require('../../infrastructure/http/middlewares/authMiddleware');

const {
    renderMovimientoForm,
    createMovimiento,
    renderMovimientos,
    renderEditForm,
    updateMovimiento,
    deleteMovimiento,
    renderControlDiario
} = require('../../application/controllers/movimientosController');

// Rutas para crear movimientos
router.get('/movimientos/add', authMiddleware, renderMovimientoForm);
router.post('/movimientos/new-mov', authMiddleware, createMovimiento);

// Rutas para listar movimientos
router.get('/movimientos', authMiddleware, renderMovimientos);

// Rutas para editar movimientos
router.get('/movimientos/edit/:id', authMiddleware, renderEditForm);
router.put('/movimientos/edit-mov/:id', authMiddleware, updateMovimiento);

// Rutas para eliminar movimientos
router.delete('/movimientos/delete/:id', authMiddleware, deleteMovimiento);

//Rutas para listar movimientos diarios
router.get('/movimientos/control-diario', authMiddleware, renderControlDiario);

module.exports = router;