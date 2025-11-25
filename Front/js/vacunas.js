const APIURL_VACUNAS = "http://localhost:7000/api/vacunas/";

let idEditando = null;
const modalElement = document.getElementById("modalVacuna");
const modal = new bootstrap.Modal(modalElement);

// Permitir uso global de funciones
window.editarVacuna = editarVacuna;
window.eliminarVacuna = eliminarVacuna;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosVacunas() {
    try {
        const res = await fetch(APIURL_VACUNAS);
        if (!res.ok) throw new Error(`Error al cargar vacunas: ${res.status}`);

        const vacunas = await res.json();
        const tbody = document.getElementById("tablaVacunas");
        tbody.innerHTML = "";

        vacunas.forEach(v => {
            tbody.innerHTML += `
                <tr>
                    <td>${v.codigo || ""}</td>
                    <td>${v.nombre || ""}</td>
                    <td>${v.descripcion || ""}</td>
                    <td>${v.aplicableA ? v.aplicableA.join(', ') : ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarVacuna('${v._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarVacuna('${v._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando vacunas.");
    }
}

// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("vacunaFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        codigo: document.getElementById("codigoVacuna").value,
        nombre: document.getElementById("nombreVacuna").value,
        descripcion: document.getElementById("descripcionVacuna").value,
        aplicableA: document.getElementById("aplicableAVacuna").value.split(',').map(v => v.trim())
    };

    try {
        if (!idEditando) {
            // Crear nueva vacuna
            const res = await fetch(APIURL_VACUNAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear vacuna");
        } else {
            // Actualizar vacuna existente
            const res = await fetch(APIURL_VACUNAS + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar vacuna");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva Vacuna";
        }

        e.target.reset();
        modal.hide();
        cargarDatosVacunas();

    } catch (error) {
        console.error(error);
        alert("Error guardando vacuna.");
    }
});

// ===============================
// EDITAR (CON CUIDADO - VERSIÓN SEGURA)
// ===============================
async function editarVacuna(idVacuna) {
    console.log("ID recibido desde botón:", idVacuna);

    try {
        const res = await fetch(`${APIURL_VACUNAS}${idVacuna}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const vacuna = await res.json();
        console.log("Vacuna recibida:", vacuna);

        idEditando = idVacuna;

        // Llenar los campos del formulario
        document.getElementById("codigoVacuna").value = vacuna.codigo || "";
        document.getElementById("nombreVacuna").value = vacuna.nombre || "";
        document.getElementById("descripcionVacuna").value = vacuna.descripcion || "";
        document.getElementById("aplicableAVacuna").value = vacuna.aplicableA ? vacuna.aplicableA.join(', ') : "";

        // Cambiar título del modal
        document.querySelector(".modal-title").textContent = "Editar Vacuna";

        // Abrir modal
        modal.show();

    } catch (err) {
        console.error("Error al obtener vacuna por ID:", err);
        alert("No se pudo obtener la vacuna. Revisa la consola / network.");
    }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarVacuna(id) {
    if (!confirm("¿Seguro que deseas eliminar esta vacuna?")) return;

    try {
        const res = await fetch(APIURL_VACUNAS + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosVacunas();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar vacuna.");
    }
}

cargarDatosVacunas();