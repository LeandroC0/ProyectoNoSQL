// reportes.js
const APIURL_REPORTES = "http://localhost:7000/api/reportes/";

let idEditando = null;
const modalElement = document.getElementById("modalReportes");
const modal = new bootstrar.Modal(modalElement);

// Permitir uso global de funciones
window.editarReportes = editarReportes;
window.eliminarReportes = eliminarReportes;


// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosReportes() {
    try {
        const res = await fetch(APIURL_REPORTES);
        if (!res.ok) throw new Error(`Error al cargar reportes: ${res.status}`);

        const reporte = await res.json();
        const tbody = document.getElementById("tablaReportes");
        tbody.innerHTML = "";

        reporte.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r.idReporte || ""}</td>
                    <td>${r.usuarioReporta || ""}</td>
                    <td>${r.usuarioDenunciado || ""}</td>
                    <td>${r.mascota || ""}</td>
                    <td>${r.tipo || ""}</td>
                    <td>${r.descripcion || ""}</td>
                    <td>${r.evidenciaUrl || ""}</td>
                    <td>${r.estado || ""}</td>
                    <td>${r.fecha || ""}</td>

                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarReportes('${r._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarReportes('${r._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando reportes.");
    }
}


// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("tipoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idReporte: document.getElementById("idReporte").value,
        usuarioReporta: document.getElementById("usuarioReporta").value,
        usuarioDenunciado: document.getElementById("usuarioDenunciado").value,
        refugio: document.getElementById("refugio").value,
        mascota: document.getElementById("mascota").value,
        tipo: document.getElementById("tipo").value,
        descripcion: document.getElementById("descripcion").value,
        evidenciaUrl: document.getElementById("evidenciaUrl").value,
        estado: document.getElementById("estado").value,
        fecha: document.getElementById("fecha").value

    };

    try {
        if (!idEditando) {
            // Crear nuevo reporte
            const res = await fetch(APIURL_REPORTES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear reporte");
        } else {
            // Actualizar reportes
            const res = await fetch(APIURL_REPORTES + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar reporte");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo reporte";
        }

        e.target.reset();
        modal.hide();
        cargarDatosReportes();

    } catch (error) {
        console.error(error);
        alert("Error guardando reportes.");
    }
});


// ===============================
// EDITAR
// ===============================
// ===============================
// EDITAR
// ===============================
async function editarReportes(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/reportes/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const p = await res.json();

        idEditando = _id; // Guarda el ID para usarlo luego en actualizar

        // CORREGIR: Usar los mismos IDs que están en el HTML
        document.getElementById("idReporte").value = r.idReporte || "";
        document.getElementById("usuarioReporta").value = r.usuarioReporta || ""; 
        document.getElementById("usuarioDenunciado").value = r.usuarioDenunciado || ""; 
        document.getElementById("refugio").value = r.refugio || "";
        document.getElementById("mascota").value = r.mascota || "";
        document.getElementById("tipo").value = r.tipo || "";
        document.getElementById("descripcion").value = r.descripcion || "";
        document.getElementById("evidenciaUrl").value = r.evidenciaUrl || "";
        document.getElementById("estado").value = r.estado || "";
        document.getElementById("fecha").value = r.fecha || "";


        // Cambiar título del modal
        document.querySelector(".modal-title").textContent = "Editar reportes";

        // Abrir modal
        modal.show();

    } catch (err) {
        console.error("Error al obtener tipo por ID:", err);
        alert("No se pudo obtener los reportes. Revisa la consola / network.");
    }
}


// ===============================
// ELIMINAR
// ===============================
async function eliminarReportes(id) {
    if (!confirm("¿Seguro que deseas eliminar este reporte?")) return;

    try {
        const res = await fetch(APIURL_REPORTES + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosReportes();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar reportes.");
    }
}

cargarDatosReportes();
