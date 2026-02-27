import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'; 
import path from 'path';
import __dirname from './utils/utils.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

const app = express();

// Middleware para parsear JSON y datos de formularios

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars como motor de plantillas

app.engine('handlebars', handlebars.engine({
  layoutsDir: path.join(__dirname, '../views/layouts'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, '../views/partials')
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middleware para servir archivos estáticos

app.use('/', express.static(path.join(__dirname, '../../public')));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);
 
// Iniciar el servidor

const PORT = 8080;

// app.listen(PORT, () => {console.log(`El servidor se corre en http://localhost:${PORT}`);});

// Iniciar el servidor HTTP y luego configurar Socket.IO

const httpServer = app.listen(8080, () => {
    console.log(`El servidor se corre en http://localhost:8080`);
});

const io = new Server(httpServer);

app.set("io", io);

io.on('connection', socket => {
  console.log('Nuevo cliente conectado ' + socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado ' + socket.id);
  });
});

