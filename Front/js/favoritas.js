const APIURL_FAVOR = "http://localhost:7000/api/favoritas/";

let idEditando = null;
const modalElement = document.getElementById("modalFavoritas");
const modal = new bootstrap.Modal(modalElement);


window.editarFavorito = editarFavorito;
window.eliminarFavorito = eliminarFavorito;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosFavoritas() {
    try {
        console.log("Cargando datos...");
        const res = await fetch(APIURL_FAVOR);
        if (!res.ok) throw new Error(`Error al cargar favoritas: ${res.status}`);

        const favor = await res.json();
        console.log("Datos recibidos:", favor);
        
        const tbody = document.getElementById("tablaFavoritas");
        tbody.innerHTML = "";

        favor.forEach(f => {
            tbody.innerHTML += `
                <tr>
                    <td>${f.idFavorito || ""}</td>
                    <td>${f.usuario || ""}</td>
                    <td>${f.mascota || ""}</td>
                    <td>${f.fechaGuardado || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarFavorito('${f._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarFavorito('${f._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("Error cargando favoritas:", err);
        alert("Error cargando favoritas.");
    }
}

// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("favoritasFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idFavorito: document.getElementById("idFavorito").value,
        usuario: document.getElementById("usuarioFavorito").value,
        mascota: document.getElementById("mascotaFavorito").value,
        fechaGuardado: document.getElementById("fechaGuardado").value
    };

    try {
        if (!idEditando) {
            // Crear nuevo favorito
            const res = await fetch(APIURL_FAVOR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear favorito");
        } else {
            // Actualizar favorito existente
            const res = await fetch(APIURL_FAVOR + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar favorito");
            idEditando = null;
        }

        e.target.reset();
        modal.hide();
        cargarDatosFavoritas(); 

    } catch (error) {
        console.error(error);
        alert("Error guardando favorito.");
    }
});

// ===============================
// EDITAR
// ===============================
async function editarFavorito(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/favoritas/${_id}`);
        if (!res.ok) throw new Error(`GET por ID falló: ${res.status}`);

        const f = await res.json();
        idEditando = _id;

        document.getElementById("idFavorito").value = f.idFavorito || "";
        document.getElementById("usuarioFavorito").value = f.usuario || "";
        document.getElementById("mascotaFavorito").value = f.mascota || "";
        document.getElementById("fechaGuardado").value = f.fechaGuardado || "";

        document.querySelector(".modal-title").textContent = "Editar Favorito";
        modal.show();

    } catch (err) {
        console.error("Error al obtener favorito por ID:", err);
        alert("No se pudo obtener el favorito.");
    }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarFavorito(id) {
    if (!confirm("¿Seguro que deseas eliminar este favorito?")) return;

    try {
        const res = await fetch(APIURL_FAVOR + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");
        cargarDatosFavoritas();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar favorito.");
    }
}

cargarDatosFavoritas();