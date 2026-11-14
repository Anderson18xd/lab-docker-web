const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Base de datos simulada en memoria RAM del contenedor
let baseDeDatosNotas = [
    { id: 1, curso: 'Cálculo en una Variable', promedio: '16.5', estado: 'APROBADO', aprobado: true }
];

// 1. RUTA GET: El Mesero pide la lista de todos los cursos guardados
app.get('/api/notas', (req, res) => {
    console.log('[COCINA - GET] Enviando lista de notas al Salón');
    res.json(baseDeDatosNotas);
});

// 2. RUTA POST: El Mesero envía un nuevo curso para calcular y guardar
app.post('/api/notas', (req, res) => {
    const { curso, nota1, nota2 } = req.body;
    const promedio = ((Number(nota1) + Number(nota2)) / 2).toFixed(1);
    const aprobado = promedio >= 10.5;

    const nuevoRegistro = {
        id: Date.now(), // Genera un ID único basado en los milisegundos actuales
        curso: curso || 'Curso sin nombre',
        promedio: promedio,
        estado: aprobado ? 'APROBADO' : 'A SUSTITUTORIO',
        aprobado: aprobado
    };

    baseDeDatosNotas.push(nuevoRegistro);
    console.log(`[COCINA - POST] Guardado: ${nuevoRegistro.curso} con ${promedio}`);
    res.status(201).json(nuevoRegistro);
});

// 3. RUTA DELETE: El Mesero pide borrar un curso por su ID
app.delete('/api/notas/:id', (req, res) => {
    const idBorrar = Number(req.params.id);
    baseDeDatosNotas = baseDeDatosNotas.filter(item => item.id !== idBorrar);
    console.log(`[COCINA - DELETE] Registro ${idBorrar} eliminado`);
    res.json({ mensaje: 'Eliminado correctamente' });
});

app.listen(PORT, () => {
    console.log(`Cocina Node.js lista en puerto interno ${PORT}`);
});