const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../../infrastructure/http/middlewares/authMiddleware');

// Ruta para la página de inicio
router.get('/', (req, res) => {
    res.render('pages/home');
});

// Ruta para login & register
router.get('/login&register', (req, res) => {
    res.render('login&register');
});

// Ruta para contact
router.get('/contact', (req, res) => {
    res.render('pages/contact');
});

router.get('/dash', authMiddleware, (req, res) => {
    res.render('pages/dash');
});

module.exports = router;
