
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
        
            const fecha = n.fecha ? (n.fecha.substring ? n.fecha.substring(0,10) : String(n.fecha)) : ""; //se utiliza fecha por que asi se llama el atributo

            //leida de tipo boolean, puede dar problemas

            const estadoLeida = n.leida ? "Sí" : "No";

            tbody.innerHTML += `
                <tr>
                    <td>${n.idNotificacion || ""}</td>
                    <td>${n.usuario || ""}</td>
                    <td>${n.mensaje || ""}</td>
                    <td>${n.tipo || ""}</td>           
                    <td>${estadoLeida}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarNotificaciones('${n.idNotificacion}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarNotificaciones('${n.idNotificacion}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        alert("Error cargando notificaciones. Revisa la consola para más detalles.");
    }
}


// ===============================
// GUARDAR O EDITAR USUARIO
// ===============================
document.getElementById("notificacionesFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const valorLeidaString = document.getElementById("leida").value;
    const leidaBoolean = valorLeidaString === "true"; // Solo es true si la cadena es exactamente "true"

    const datos = {
        idNotificacion: document.getElementById("idNotificacion").value,
        usuario: document.getElementById("usuario").value,
        mensaje: document.getElementById("mensaje").value,
        tipo: document.getElementById("tipo").value,
        leida: leidaBoolean,
        //estadoLeida: document.getElementById("estadoLeida").value,
        fecha: document.getElementById("fecha").value
    };

    try {
        if (!idEditando) {
            const res = await fetch(APIURL_NOTIFICACIONES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            const res = await fetch(APIURL_NOTIFICACIONES + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`PUT falló: ${res.status}`);
            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva Notificacion";
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
// FUNCION: EDITAR
// ===============================
async function editarNotificaciones(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(APIURL_NOTIFICACIONES + _id);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const n = await res.json();

        idEditando = _id;

        document.getElementById("idNotificacion").value = n.idNotificacion || "";
        document.getElementById("usuario").value = n.usuario || "";
        document.getElementById("mensaje").value = n.mensaje || "";
        document.getElementById("tipo").value = n.tipo || "";
        // Cambio: Cargar el booleano como cadena 'true' o 'false'
    document.getElementById("leida").value = String(n.leida);

        if (n.fecha) {
            const fecha = n.fecha.substring
                ? n.fecha.substring(0, 10)
                : String(f.fecha);
            document.getElementById("fecha").value = fecha;
        } else {
            document.getElementById("fecha").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar notificaciones";
        modal.show();

    } catch (err) {
        console.error("Error al obtener notificacion por ID:", err);
        alert("No se pudo obtener la notificacion. Revisa la consola / network.");
    }
}


// ===============================
// FUNCION: ELIMINAR
// ===============================
async function eliminarNotificaciones(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar esta notificacion?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL_NOTIFICACIONES + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);
        cargarDatosNotificaciones();
    } catch (err) {
        console.error("Error eliminando notificacion:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}


cargarDatosNotificaciones();
