const listaCursos = document.getElementById('listaCursos');
const btnGuardar = document.getElementById('btnGuardar');

// La dirección exacta de tu Cocina en AWS EC2
const API_URL = 'http://54.209.251.94:3000/api/notas';

// 1. FUNCIÓN GET
async function cargarNotas() {
    const respuesta = await fetch(API_URL);
    const notas = await respuesta.json();

    listaCursos.innerHTML = '';

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

// 2. FUNCIÓN POST
btnGuardar.addEventListener('click', async () => {
    const curso = document.getElementById('inputCurso').value;
    const nota1 = document.getElementById('inputNota1').value;
    const nota2 = document.getElementById('inputNota2').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curso, nota1, nota2 })
    });

    document.getElementById('inputCurso').value = '';
    document.getElementById('inputNota1').value = '';
    document.getElementById('inputNota2').value = '';
    cargarNotas();
});

// 3. FUNCIÓN DELETE
async function borrarNota(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    cargarNotas();
}

cargarNotas();