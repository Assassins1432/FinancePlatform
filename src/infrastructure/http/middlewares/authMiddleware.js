module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'You must be logged in to view this page');
    res.redirect('/users/signin');
};