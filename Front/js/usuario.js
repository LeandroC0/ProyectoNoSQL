// usuario.js
const APIURL = "http://localhost:7000/api/usuarios/";

// Asegurarnos de que Bootstrap ya está cargado (script tag en HTML lo carga antes)
let idEditando = null;
const modalElement = document.getElementById("modalUsuario");
const modal = new bootstrap.Modal(modalElement);

// Exportar funciones para que onclick las encuentre
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatos() {
    try {
        const res = await fetch(APIURL);
        if (!res.ok) throw new Error(`Error al cargar usuarios: ${res.status} ${res.statusText}`);
        const usuarios = await res.json();

        const tbody = document.getElementById("tablaDatos");
        tbody.innerHTML = "";

        usuarios.forEach(u => {
            // Aseguramos que fechaRegistro sea una cadena
            const fecha = u.fechaRegistro ? (u.fechaRegistro.substring ? u.fechaRegistro.substring(0,10) : String(u.fechaRegistro)) : "";

            tbody.innerHTML += `
                <tr>
                    <td>${u.nombre || ""}</td>
                    <td>${u.correo || ""}</td>
                    <td>${u.telefono || ""}</td>
                    <td>${u.direccion || ""}</td>
                    <td>${u.rol || ""}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${u._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${u._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        alert("Error cargando usuarios. Revisa la consola para más detalles.");
    }
}


// ===============================
// GUARDAR O EDITAR USUARIO
// ===============================
document.getElementById("usuarioFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        rol: document.getElementById("rol").value,
        fechaRegistro: document.getElementById("fechaRegistro").value
    };

    try {
        if (!idEditando) {
            const res = await fetch(APIURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            const res = await fetch(APIURL + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`PUT falló: ${res.status}`);
            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo Usuario";
        }

        e.target.reset();
        modal.hide();
        cargarDatos();
    } catch (err) {
        console.error("Error guardando/actualizando:", err);
        alert("Error al guardar/actualizar. Revisa la consola.");
    }
});


// ===============================
// FUNCION: EDITAR
// ===============================
async function editarUsuario(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/usuarios/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const u = await res.json();

        idEditando = _id;

        document.getElementById("nombre").value = u.nombre || "";
        document.getElementById("correo").value = u.correo || "";
        document.getElementById("telefono").value = u.telefono || "";
        document.getElementById("direccion").value = u.direccion || "";
        document.getElementById("rol").value = u.rol || "";

        if (u.fechaRegistro) {
            const fecha = u.fechaRegistro.substring
                ? u.fechaRegistro.substring(0, 10)
                : String(u.fechaRegistro);
            document.getElementById("fechaRegistro").value = fecha;
        } else {
            document.getElementById("fechaRegistro").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar Usuario";
        modal.show();

    } catch (err) {
        console.error("Error al obtener usuario por ID:", err);
        alert("No se pudo obtener el usuario. Revisa la consola / network.");
    }
}


// ===============================
// FUNCION: ELIMINAR
// ===============================
async function eliminarUsuario(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);
        cargarDatos();
    } catch (err) {
        console.error("Error eliminando usuario:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}


cargarDatos();
