
const APIURL_REPORTES = "http://localhost:7000/api/reportes/";


let idEditando = null;
const modalElement = document.getElementById("modalReportes");
const modal = new bootstrap.Modal(modalElement);

window.editarReportes = editarReportes;
window.eliminarReportes = eliminarReportes;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosReportes() {
    try {
        const res = await fetch(APIURL_REPORTES);
        if (!res.ok) throw new Error(`Error al cargar reportes: ${res.status} ${res.statusText}`);
        const reportes = await res.json();

        const tbody = document.getElementById("tablaReportes");
        tbody.innerHTML = "";

        reportes.forEach(r => {
        
            const fecha = r.fecha ? (r.fecha.substring ? r.fecha.substring(0,10) : String(r.fecha)) : "";

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
                    <td>${fecha}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarReportes('${r._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarReportes('${r._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        alert("Error cargando reportes. Revisa la consola para más detalles.");
    }
}


// ===============================
// GUARDAR O EDITAR 
// ===============================
document.getElementById("reportesFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idReporte: document.getElementById("idReporte").value,
        usuarioReporta: document.getElementById("usuarioReporta").value,
        usuarioDenunciado: document.getElementById("usuarioDenunciado").value,
        mascota: document.getElementById("mascota").value,
        tipo: document.getElementById("tipo").value,
        descripcion: document.getElementById("descripcion").value,
        evidenciaUrl: document.getElementById("evidenciaUrl").value,
        estado: document.getElementById("estado").value,
        fecha: document.getElementById("fecha").value
    };

    try {
        if (!idEditando) {
            const res = await fetch(APIURL_REPORTES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            const res = await fetch(APIURL_REPORTES + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`PUT falló: ${res.status}`);
            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo Reporte";
        }

        e.target.reset();
        modal.hide();
        cargarDatosReportes();
    } catch (err) {
        console.error("Error guardando/actualizando:", err);
        alert("Error al guardar/actualizar. Revisa la consola.");
    }
});


// ===============================
// FUNCION: EDITAR
// ===============================
async function editarReportes(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(APIURL_REPORTES + _id);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const r = await res.json();

        idEditando = _id;

        //document.getElementById("idFavorito").value = f.idFavorito || "";
        //document.getElementById("usuario").value = f.usuario || "";
        //document.getElementById("mascota").value = f.mascota || "";


        document.getElementById("idReporte").value = r.idReporte || "";
        document.getElementById("usuarioReporta").value = r.usuarioReporta || "";
        document.getElementById("usuarioDenunciado").value = r.usuarioDenunciado || "";
        document.getElementById("mascota").value = r.mascota || "";
        document.getElementById("tipo").value = r.tipo || "";
        document.getElementById("descripcion").value = r.descripcion || "";
        document.getElementById("evidenciaUrl").value = r.evidenciaUrl || "";
        document.getElementById("estado").value = r.estado || "";
        //document.getElementById("fecha").value = r.fecha;

        if (r.fecha) {
            const fecha = r.fecha.substring
                ? r.fecha.substring(0, 10)
                : String(r.fecha);
            document.getElementById("fecha").value = fecha;
        } else {
             document.getElementById("fecha").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar reportes";
        modal.show();

    } catch (err) {
        console.error("Error al obtener reporte por ID:", err);
        alert("No se pudo obtener el reporte. Revisa la consola / network.");
    }
}


// ===============================
// FUNCION: ELIMINAR
// ===============================
async function eliminarReportes(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este reporte?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL_REPORTES + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);
        cargarDatosReportes();
    } catch (err) {
        console.error("Error eliminando reporte:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}


cargarDatosReportes();
