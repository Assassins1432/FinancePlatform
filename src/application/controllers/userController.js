const usersCtrl = {};
const passport = require('passport');
const User = require('../../core/users/models/userModel');

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('user/login&register', { showRegister: true });
};

usersCtrl.signup = async (req, res) => {
    const errors = [];
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
        errors.push({ text: "Passwords do not match." });
    }
    if (password.length < 4) {
        errors.push({ text: "Passwords must be at least 4 characters." });
    }
    if (errors.length > 0) {
        req.session.messages = errors.map(err => ({ type: 'error', message: err.text }));
        return res.render('user/login&register', {
            name,
            email,
            password,
            confirm_password,
            showRegister: true,
        });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.session.messages = [{ type: 'error', message: 'The email is already registered.' }];
            return res.redirect('/users/signup');
        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.session.messages = [{ type: 'success', message: 'You are now registered and can log in.' }];
            return res.redirect('/users/signin');
        }
    }
};

usersCtrl.renderSignInForm = (req, res) => {
    res.render('user/login&register', { showRegister: false });
};

usersCtrl.signin = passport.authenticate('local', {
    successRedirect: '/dash',
    failureRedirect: '/users/signin',
    failureFlash: true,
});

usersCtrl.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.messages = [{ type: 'success', message: 'You are logged out.' }];
        res.redirect('/users/signin');
    });
};

module.exports = usersCtrl;
