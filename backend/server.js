const express = require('express');
const cors = require('cors'); // <-- 1. Importamos CORS
const app = express();
const PORT = 3000;

// <-- 2. Damos permiso EXCLUSIVO a tu bucket S3
app.use(cors({
    origin: 'http://mi-bucket-s3-ander-18857.s3-website-us-east-1.amazonaws.com',
    methods: ['GET', 'POST', 'DELETE']
}));

app.use(express.json());

let baseDeDatosNotas = [
    { id: 1, curso: 'Cálculo en una Variable', promedio: '16.5', estado: 'APROBADO', aprobado: true }
];

app.get('/api/notas', (req, res) => {
    console.log('[COCINA AWS - GET] Enviando lista de notas a S3');
    res.json(baseDeDatosNotas);
});

app.post('/api/notas', (req, res) => {
    const { curso, nota1, nota2 } = req.body;
    const promedio = ((Number(nota1) + Number(nota2)) / 2).toFixed(1);
    const aprobado = promedio >= 10.5;

    const nuevoRegistro = {
        id: Date.now(),
        curso: curso || 'Curso sin nombre',
        promedio: promedio,
        estado: aprobado ? 'APROBADO' : 'A SUSTITUTORIO',
        aprobado: aprobado
    };

    baseDeDatosNotas.push(nuevoRegistro);
    console.log(`[COCINA AWS - POST] Guardado: ${nuevoRegistro.curso}`);
    res.status(201).json(nuevoRegistro);
});

app.delete('/api/notas/:id', (req, res) => {
    const idBorrar = Number(req.params.id);
    baseDeDatosNotas = baseDeDatosNotas.filter(item => item.id !== idBorrar);
    console.log(`[COCINA AWS - DELETE] Registro ${idBorrar} eliminado`);
    res.json({ mensaje: 'Eliminado correctamente' });
});

app.listen(PORT, () => {
    console.log(`Cocina Node.js en AWS escuchando en puerto ${PORT}`);
});