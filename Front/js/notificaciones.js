const APIURL_NOTIFICACIONES = "http://localhost:7000/api/notificaciones/";

let idEditando = null;

const modalElement = document.getElementById("modalNotificaciones");
const modal = new bootstrap.Modal(modalElement);

window.editarNotificaciones = editarNotificaciones;
window.eliminarNotificaciones = eliminarNotificaciones;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosNotificaciones() {
    try {
        const res = await fetch(APIURL_NOTIFICACIONES);
        if (!res.ok) throw new Error(`Error al cargar notificaciones: ${res.status} ${res.statusText}`);

        const notificaciones = await res.json();
        const tbody = document.getElementById("tablaNotificaciones");
        tbody.innerHTML = "";

        notificaciones.forEach(n => {
            const fecha = n.fecha ? String(n.fecha).substring(0, 10) : "";
            const estadoLeida = n.leida ? "Sí" : "No";

            tbody.innerHTML += `
                <tr>
                    <td>${n.idNotificacion || n._id}</td>
                    <td>${n.usuario || ""}</td>
                    <td>${n.mensaje || ""}</td>
                    <td>${n.tipo || ""}</td>
                    <td>${estadoLeida}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarNotificaciones('${n._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarNotificaciones('${n._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando notificaciones. Revisa la consola.");
    }
}

// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("notificacionesFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const valorLeidaString = document.getElementById("leida").value;
    const leidaBoolean = valorLeidaString === "true";

    const datos = {
        idNotificacion: document.getElementById("idNotificacion").value,
        usuario: document.getElementById("usuario").value,
        mensaje: document.getElementById("mensaje").value,
        tipo: document.getElementById("tipo").value,
        leida: leidaBoolean,
        fecha: document.getElementById("fecha").value
    };

    try {
        if (!idEditando) {
            // POST
            const res = await fetch(APIURL_NOTIFICACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            // PUT
            const res = await fetch(APIURL_NOTIFICACIONES + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`PUT falló: ${res.status}`);

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva Notificación";
        }

        e.target.reset();
        modal.hide();
        cargarDatosNotificaciones();

    } catch (err) {
        console.error("Error guardando/actualizando:", err);
        alert("Error al guardar/actualizar. Revisa la consola.");
    }
});

// ===============================
// EDITAR
// ===============================
async function editarNotificaciones(_id) {
    try {
        const res = await fetch(APIURL_NOTIFICACIONES + _id);
        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status}`);
        }

        const n = await res.json();
        idEditando = _id;

        document.getElementById("idNotificacion").value = n.idNotificacion || "";
        document.getElementById("usuario").value = n.usuario || "";
        document.getElementById("mensaje").value = n.mensaje || "";
        document.getElementById("tipo").value = n.tipo || "";
        document.getElementById("leida").value = String(n.leida);

        // CORREGIDO: manejo seguro de fecha
        if (n.fecha) {
            const fechaFormateada = String(n.fecha).substring(0, 10);
            document.getElementById("fecha").value = fechaFormateada;
        } else {
            document.getElementById("fecha").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar Notificación";
        modal.show();

    } catch (err) {
        console.error("Error al obtener notificación por ID:", err);
        alert("No se pudo obtener la notificación. Revisa la consola o red.");
    }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarNotificaciones(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar esta notificación?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL_NOTIFICACIONES + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);

        cargarDatosNotificaciones();

    } catch (err) {
        console.error("Error eliminando notificación:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}

// Cargar datos al inicio
cargarDatosNotificaciones();
