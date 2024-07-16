const express = require('express');
const mongoose = require('mongoose'); // Modulo mongoose para conectar con la base de datos.
const dotenv = require('dotenv'); // Modulo dotenv para cargar las variables de entorno.
const path = require('path');
const session = require('express-session'); // Modulo espress-session esto nos ayudara a guardar algunos datos en la memoria del servidor para mantener la sesión del usuario.
const passport = require('passport'); // Modulo passport para autenticación.
const authMiddleware = require('./infrastructure/http/middlewares/authMiddleware');
const methodOverride = require('method-override') // Modulo method-override esto nos ayudara a sobreescribir los metodos HTTP por defecto de la aplicación.
const morgan = require('morgan');

dotenv.config();
require('./infrastructure/http/passport-config')


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 semana
    }
}));
app.use(passport.initialize());
app.use(passport.session());


// Configurar el motor de vistas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configurar sesiones y autenticación
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(db => console.log('Connected to database'))
    .catch(err => console.log(err));

// Global Variables
app.use((req, res, next) => {
    res.locals.messages = req.session.messages || [];
    req.session.messages = [];
    next();
});

app.use((req, res, next) => {
    req.flash = (type, message) => {
        req.session.messages.push({ type, message });
    };
    next();
});

// Usar las rutas de la plataforma
const platformRoutes = require('./interfaces/http/routes');
const contabilidadesRoutes = require('./interfaces/http/contabilidades.routes');
const movimientosRoutes = require('./interfaces/http/movimientos.routes');
const categoriasRoutes = require('./interfaces/http/categorias.routes');
const bancosRoutes = require('./interfaces/http/bancos.routes');
const etiquetasRoutes = require('./interfaces/http/etiquetas.routes');
const tercerosRoutes = require('./interfaces/http/terceros.routes');
const userRoutes = require('./interfaces/http/user.routes');
const testFlashRoutes = require('./interfaces/http/routes');
app.use(platformRoutes);
app.use(contabilidadesRoutes);
app.use(movimientosRoutes);
app.use(categoriasRoutes);
app.use(etiquetasRoutes);
app.use(tercerosRoutes);
app.use(bancosRoutes);
app.use(userRoutes);
app.use(testFlashRoutes);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).render('pages/404', { title: '404 - Página no encontrada' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
