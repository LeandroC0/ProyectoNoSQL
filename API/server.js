//Crea el server principal

//npm install express mongoose body-parser cors
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');//URL y https


//const rutas
const mascotasRoutes = require('./routes/mascotasRoutes');
const registrosRoutes = require('./routes/registrosRoutes');
const reseñasRoutes = require('./routes/reseñasRoutes');
const tipomascotaRoutes = require('./routes/tipomascotaRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const vacunasRoutes = require('./routes/vacunasRoutes');
const favoritasRoutes = require('./routes/favoritasRoutes');
const fotosmascotaRoutes = require('./routes/fotosmascotaRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');
const partemedicoRoutes = require('./routes/partemedicoRoutes');
const peticionesRoutes = require('./routes/peticionadopcionRoutes');
const reportesRoutes = require('./routes/reportesRoutes');


const app = express();
const PORT = 7000;


//Middlewares (Son como las urls del sitio) 
app.use(cors());
app.use(bodyParser.json());


//Conexion hacia mongo
mongoose.connect('mongodb://localhost:27017/PetMatchDB')
  .then(() => console.log('Mongo DB Success'))
  .catch(err => console.log('Mongo DB error:', err));


//las rutas
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/resenas', reseñasRoutes);
app.use('/api/tipomascota', tipomascotaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vacunas', vacunasRoutes);
app.use('/api/favoritas', favoritasRoutes)
app.use('/api/fotosmascota', fotosmascotaRoutes)
app.use('/api/notificaiones', notificacionesRoutes)
app.use('/api/partemedico', partemedicoRoutes)
app.use('/api/peticionadopcion', peticionesRoutes)
app.use('/api/reportes', reportesRoutes)



//Inciar el servidor, o como veremos el server.
app.listen(PORT, ()=>{
    console.log(`Servidor encendido http://localhost:${PORT}`);
});