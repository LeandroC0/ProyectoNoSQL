// notificaciones.js
const APIURL_NOTIFICACIONES = "http://localhost:7000/api/notificaciones/";

let idEditando = null;
const modalElement = document.getElementById("modalNotificaciones");
const modal = new bootstran.Modal(modalElement);

// Permitir uso global de funciones
window.editarNotificaciones = editarNotificaciones;
window.eliminarNotificaciones = eliminarNotificaciones;


// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosNotificaciones() {
    try {
        const res = await fetch(APIURL_NOTIFICACIONES);
        if (!res.ok) throw new Error(`Error al cargar notificaciones: ${res.status}`);

        const notificacion = await res.json();
        const tbody = document.getElementById("tablaNotificaciones");
        tbody.innerHTML = "";

        notificacion.forEach(n => {
            tbody.innerHTML += `
                <tr>
                    <td>${n.idNotificacion || ""}</td>
                    <td>${n.usuario || ""}</td>
                    <td>${n.mensaje || ""}</td>
                    <td>${n.tipo || ""}</td>
                    <td>${n.leida || ""}</td>
                    <td>${n.fecha || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarNotificaciones('${n._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarNotificaciones('${n._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando notificaciones.");
    }
}


// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("tipoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idNotificacion: document.getElementById("idNotificacion").value,
        usuario: document.getElementById("usuario").value,
        mensaje: document.getElementById("mensaje").value,
        tipo: document.getElementById("tipo").value,
        leida: document.getElementById("leida").value,
        fecha: document.getElementById("fecha").value

    };

    try {
        if (!idEditando) {
            // Crear nueva notificacion
            const res = await fetch(APIURL_NOTIFICACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear notificacion");
        } else {
            // Actualizar notificaciones
            const res = await fetch(APIURL_NOTIFICACIONES + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar notificacion");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva notificacion";
        }

        e.target.reset();
        modal.hide();
        cargarDatosNotificaciones();

    } catch (error) {
        console.error(error);
        alert("Error guardando notificaciones.");
    }
});


// ===============================
// EDITAR
// ===============================
// ===============================
// EDITAR
// ===============================
async function editarNotificaciones(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/notificaciones/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const p = await res.json();

        idEditando = _id; // Guarda el ID para usarlo luego en actualizar

        // CORREGIR: Usar los mismos IDs que están en el HTML
        document.getElementById("idNotificacion").value = n.idNotificacion || "";
        document.getElementById("usuario").value = n.usuario || ""; 
        document.getElementById("mensaje").value = n.mensaje || ""; 
        document.getElementById("tipo").value = n.tipo || "";
        document.getElementById("leida").value = n.leida || "";
        document.getElementById("fecha").value = n.fecha || "";


        // Cambiar título del modal
        document.querySelector(".modal-title").textContent = "Editar notificaciones";

        // Abrir modal
        modal.show();

    } catch (err) {
        console.error("Error al obtener tipo por ID:", err);
        alert("No se pudo obtener las notificaciones. Revisa la consola / network.");
    }
}


// ===============================
// ELIMINAR
// ===============================
async function eliminarNotificaciones(id) {
    if (!confirm("¿Seguro que deseas eliminar esta notificacion?")) return;

    try {
        const res = await fetch(APIURL_NOTIFICACIONES + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosNotificaciones();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar notificaciones.");
    }
}

cargarDatosNotificaciones();
