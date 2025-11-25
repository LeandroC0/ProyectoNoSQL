//Crea el server principal

//npm install express mongoose body-parser cors
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');//URL y https


//const rutas
const mascotasRoutes = require('./routes/mascotasRoutes');
const registrosRoutes = require('./routes/registrosRoutes');
//const reseñasRoutes = require('./routes/reseñasRoutes');
const tipomascotaRoutes = require('./routes/tipomascotaRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const vacunasRoutes = require('./routes/vacunasRoutes');



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
//app.use('/api/resenas', reseñasRoutes);
app.use('/api/tipomascota', tipomascotaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vacunas', vacunasRoutes);



//Inciar el servidor, o como veremos el server.
app.listen(PORT, ()=>{
    console.log(`Servidor encendido http://localhost:${PORT}`);
});