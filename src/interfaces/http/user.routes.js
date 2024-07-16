const express = require('express');
const router = express.Router();

const { renderSignUpForm, signup, logout, renderSignInForm, signin } = require('../../application/controllers/userController');

router.get('/users/signup', renderSignUpForm);

router.post('/users/signup', signup);

router.get('/users/signin', renderSignInForm);

router.post('/users/signin', signin);

router.get('/users/logout', logout);

module.exports = router;