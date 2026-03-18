import 'dotenv/config';
import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';

// Importación de base de datos
import dbConnection from './config/db.js';

// Importación de rutas
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'; 
import viewsRouter from './routes/views.router.js';
import __dirname from './utils/utils.js';

const app = express();

// Conexión a Base de Datos
dbConnection();

// Middleware y Configuración
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Motor de Plantillas (Handlebars)
app.engine('handlebars', handlebars.engine({
  layoutsDir: path.join(__dirname, '../views/layouts'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, '../views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Archivos estáticos y Rutas
app.use('/', express.static(path.join(__dirname, '../../public')));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Servidor y Socket.io
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(httpServer);
app.set("io", io);

io.on('connection', socket => {
  console.log('Nuevo cliente conectado ' + socket.id);
  socket.on('disconnect', () => {
    console.log('Cliente desconectado ' + socket.id);
  });
});