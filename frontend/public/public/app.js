const listaCursos = document.getElementById('listaCursos');
const btnGuardar = document.getElementById('btnGuardar');

// 1. FUNCIÓN GET: Pide las notas guardadas en el contenedor Backend y las dibuja
async function cargarNotas() {
    const respuesta = await fetch('/api/notas'); // Nginx redirige esto a backend-node:3000
    const notas = await respuesta.json();

    listaCursos.innerHTML = ''; // Limpiamos la lista antes de redibujar

    notas.forEach(item => {
        const div = document.createElement('div');
        div.className = `item-curso ${item.aprobado ? 'verde' : 'rojo'}`;
        div.innerHTML = `
            <span><b>${item.curso}</b>: ${item.promedio} (${item.estado})</span>
            <button class="btn-borrar" onclick="borrarNota(${item.id})">Eliminar</button>
        `;
        listaCursos.appendChild(div);
    });
}

// 2. FUNCIÓN POST: Envía una nueva nota cuando haces clic en el botón azul
btnGuardar.addEventListener('click', async () => {
    const curso = document.getElementById('inputCurso').value;
    const nota1 = document.getElementById('inputNota1').value;
    const nota2 = document.getElementById('inputNota2').value;

    await fetch('/api/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curso, nota1, nota2 })
    });

    // Limpiamos los cuadritos y recargamos la lista con GET
    document.getElementById('inputCurso').value = '';
    document.getElementById('inputNota1').value = '';
    document.getElementById('inputNota2').value = '';
    cargarNotas();
});

// 3. FUNCIÓN DELETE: Borra una nota específica cuando aprietas "Eliminar"
async function borrarNota(id) {
    await fetch(`/api/notas/${id}`, {
        method: 'DELETE'
    });
    cargarNotas(); // Volvemos a pedir la lista actualizada
}

// Apenas se abre la página por primera vez, ejecutamos el GET inicial
cargarNotas();