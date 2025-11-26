// fotosmascota.js
const APIURL_FOTO = "http://localhost:7000/api/fotosmascota/";

let idEditando = null;
const modalElement = document.getElementById("modalFotoMascota");
const modal = new bootstrap.Modal(modalElement);

// Permitir uso global de funciones
window.editarFotoMascota = editarFotoMascota;
window.eliminarFotoMascota = eliminarFotoMascota;


// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosFotoMascota() {
    try {
        const res = await fetch(APIURL_FOTO);
        if (!res.ok) throw new Error(`Error al cargar foto: ${res.status}`);

        const foto = await res.json();
        const tbody = document.getElementById("tablaFotoMascota");
        tbody.innerHTML = "";

        foto.forEach(f => {
            tbody.innerHTML += `
                <tr>
                    <td>${f.idFoto || ""}</td>
                    <td>${f.mascota || ""}</td>
                    <td>${f.url || ""}</td>
                    <td>${f.descripcion || ""}</td>
                    <td>${f.fechaSubida || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarFotoMascota('${f._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarFotoMascota('${f._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando foto.");
    }
}


// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("tipoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idFoto: document.getElementById("idFoto").value,
        url: document.getElementById("url").value,
        mascota: document.getElementById("mascota").value,
        descripcion: document.getElementById("descripcionFoto").value,
        fechaSubida: document.getElementById("fechaSubida").value
    };

    try {
        if (!idEditando) {
            // Crear nueva foto
            const res = await fetch(APIURL_FOTO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear foto de mascota");
        } else {
            // Actualizar fotos existentes
            const res = await fetch(APIURL_FOTO + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar foto de mascota");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo foto de mascota";
        }

        e.target.reset();
        modal.hide();
        cargarDatosFotoMascota();

    } catch (error) {
        console.error(error);
        alert("Error guardando foto de mascota.");
    }
});


// ===============================
// EDITAR
// ===============================
// ===============================
// EDITAR
// ===============================
async function editarFotoMascota(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/fotosmascota/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const f = await res.json();

        idEditando = _id; // Guarda el ID para usarlo luego en actualizar

        // CORREGIR: Usar los mismos IDs que están en el HTML
        document.getElementById("idFoto").value = f.idFoto || "";
        document.getElementById("mascota").value = f.mascota || ""; 
        document.getElementById("url").value = f.url || ""; 
        document.getElementById("descripcionFoto").value = t.descripcion || "";
        document.getElementById("fechaSubida").value = f.fechaSubida || "";

        // Cambiar título del modal
        document.querySelector(".modal-title").textContent = "Editar fotos de mascota";

        // Abrir modal
        modal.show();

    } catch (err) {
        console.error("Error al obtener tipo por ID:", err);
        alert("No se pudo obtener la foto de la mascota. Revisa la consola / network.");
    }
}


// ===============================
// ELIMINAR
// ===============================
async function eliminarFotoMascota(id) {
    if (!confirm("¿Seguro que deseas eliminar esta foto de mascota?")) return;

    try {
        const res = await fetch(APIURL_FOTO + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosFotoMascota();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar foto.");
    }
}

cargarDatosFotoMascota();
