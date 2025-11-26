// favoritas.js
const APIURL_FAVOR = "http://localhost:7000/api/favoritas/";

let idEditando = null;
const modalElement = document.getElementById("modalFavoritas");
const modal = new bootstrap.Modal(modalElement);

// Permitir uso global de funciones
window.editarFavoritas = editarFavoritas;
window.eliminarFavoritas = eliminarFavoritas;


// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosFavoritas() {
    try {
        const res = await fetch(APIURL_FAVOR);
        if (!res.ok) throw new Error(`Error al cargar favoritas: ${res.status}`);

        const tipos = await res.json();
        const tbody = document.getElementById("tablaFavoritas");
        tbody.innerHTML = "";

        tipos.forEach(f => {
            tbody.innerHTML += `
                <tr>
                    <td>${f.idFavorito || ""}</td>
                    <td>${f.usuario || ""}</td>
                    <td>${f.mascota || ""}</td>
                    <td>${f.fechaGuardado || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarTipo('${f._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarTipo('${f._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando favoritas.");
    }
}


// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("tipoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idFavorito: document.getElementById("idFavorito").value,
        usuario: document.getElementById("usuario").value,
        mascota: document.getElementById("mascota").value,
        fechaGuardado: document.getElementById("fechaGuardado").value
    };

    try {
        if (!idEditando) {
            // Crear nuevo tipo
            const res = await fetch(APIURL_FAVOR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear favoritas");
        } else {
            // Actualizar favoritas existentes
            const res = await fetch(APIURL_FAVOR + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar favoritas");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo Favorito";
        }

        e.target.reset();
        modal.hide();
        cargarDatosTipo();

    } catch (error) {
        console.error(error);
        alert("Error guardando favorito.");
    }
});


// ===============================
// EDITAR
// ===============================
// ===============================
// EDITAR
// ===============================
async function editarFavoritas(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/favoritas/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const f = await res.json();

        idEditando = _id; // Guarda el ID para usarlo luego en actualizar

        // CORREGIR: Usar los mismos IDs que están en el HTML
        document.getElementById("idFavorito").value = f.idFavorito || "";
        document.getElementById("usuarioFavorito").value = f.usuario || ""; // Cambiado de "usuario" a "usuarioFavorito"
        document.getElementById("mascotaFavorito").value = f.mascota || ""; // Cambiado de "mascota" a "mascotaFavorito"
        document.getElementById("fechaGuardado").value = f.fechaGuardado || "";

        // Cambiar título del modal
        document.querySelector(".modal-title").textContent = "Editar Favoritos";

        // Abrir modal
        modal.show();

    } catch (err) {
        console.error("Error al obtener tipo por ID:", err);
        alert("No se pudo obtener el tipo de mascota. Revisa la consola / network.");
    }
}


// ===============================
// ELIMINAR
// ===============================
async function eliminarFavoritas(id) {
    if (!confirm("¿Seguro que deseas eliminar este favorito?")) return;

    try {
        const res = await fetch(APIURL_FAVOR + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosFavoritas();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar tipo.");
    }
}

cargarDatosFavoritas();
