require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Asegúrate de que tengas este archivo configurado para tu conexión a la base de datos.
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000; // Usar el puerto definido en las variables de entorno

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia si usas otro servicio
    auth: {
        user: process.env.EMAIL_USER, // Usa la variable de entorno
        pass: process.env.EMAIL_PASS  // Usa la variable de entorno
    }
});

// Rutas CRUD para Servicios
// Crear servicio
app.post('/servicios', async (req, res) => {
    try {
        const { descripcion, precio } = req.body;
        const newServicio = await pool.query(
            'INSERT INTO servicios (descripcion, precio) VALUES($1, $2) RETURNING *',
            [descripcion, precio]
        );
        res.json(newServicio.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al crear el servicio');
    }
});

// Obtener todos los servicios
app.get('/servicios', async (req, res) => {
    try {
        const allServicios = await pool.query('SELECT * FROM servicios');
        res.json(allServicios.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener los servicios');
    }
});

// Actualizar servicio
app.put('/servicios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, precio } = req.body;
        await pool.query(
            'UPDATE servicios SET descripcion = $1, precio = $2 WHERE id = $3',
            [descripcion, precio, id]
        );
        res.json('Servicio actualizado');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el servicio');
    }
});

// Eliminar servicio
app.delete('/servicios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM servicios WHERE id = $1', [id]);
        res.json('Servicio eliminado');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar el servicio');
    }
});

app.post('/contact', async (req, res) => {
    const { nombre, email, telefono, mensaje } = req.body;

    try {
        // Guardar en la base de datos
        const newContacto = await pool.query(
            'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, telefono, mensaje]
        );

        res.status(200).json(newContacto.rows[0]); // Devuelve el nuevo contacto
    } catch (error) {
        console.error('Error guardando el contacto:', error);
        res.status(500).send('Error al guardar el contacto');
    }
});

// Obtener todos los contactos
app.get('/contact', async (req, res) => {
    try {
        const allContactos = await pool.query('SELECT * FROM contactos');
        res.json(allContactos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener los contactos');
    }
});

// Actualizar contacto
app.put('/contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono, mensaje } = req.body;
        await pool.query(
            'UPDATE contactos SET nombre = $1, email = $2, telefono = $3, mensaje = $4 WHERE id = $5',
            [nombre, email, telefono, mensaje, id]
        );
        res.json('Contacto actualizado');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar el contacto');
    }
});

// Eliminar contacto
app.delete('/contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM contactos WHERE id = $1', [id]);
        res.json('Contacto eliminado');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar el contacto');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});
