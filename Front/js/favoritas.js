
const APIURL_FAVORITAS = "http://localhost:7000/api/favoritas/";


let idEditando = null;
const modalElement = document.getElementById("modalFavoritas");
const modal = new bootstrap.Modal(modalElement);

window.editarFavoritas = editarFavoritas;
window.eliminarFavoritas = eliminarFavoritas;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosFavoritas() {
    try {
        const res = await fetch(APIURL_FAVORITAS);
        if (!res.ok) throw new Error(`Error al cargar favoritas: ${res.status} ${res.statusText}`);
        const favoritas = await res.json();

        const tbody = document.getElementById("tablaFavoritas");
        tbody.innerHTML = "";

        favoritas.forEach(f => {
        
            const fecha = f.fechaGuardado ? (f.fechaGuardado.substring ? f.fechaGuardado.substring(0,10) : String(f.fechaGuardado)) : "";

            tbody.innerHTML += `
                <tr>
                    <td>${f.idFavorito || ""}</td>
                    <td>${f.usuario || ""}</td>
                    <td>${f.mascota || ""}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarFavoritas('${f.idFavorito}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarFavoritas('${f.idFavorito}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        alert("Error cargando favoritas. Revisa la consola para más detalles.");
    }
}


// ===============================
// GUARDAR O EDITAR USUARIO
// ===============================
document.getElementById("favoritasFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idFavorito: document.getElementById("idFavorito").value,
        usuario: document.getElementById("usuario").value,
        mascota: document.getElementById("mascota").value,
        fechaGuardado: document.getElementById("fechaGuardado").value
    };

    try {
        if (!idEditando) {
            const res = await fetch(APIURL_FAVORITAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            const res = await fetch(APIURL_FAVORITAS + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`PUT falló: ${res.status}`);
            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva Favorita";
        }

        e.target.reset();
        modal.hide();
        cargarDatosFavoritas();
    } catch (err) {
        console.error("Error guardando/actualizando:", err);
        alert("Error al guardar/actualizar. Revisa la consola.");
    }
});


// ===============================
// FUNCION: EDITAR
// ===============================
async function editarFavoritas(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(APIURL_FAVORITAS + _id);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const f = await res.json();

        idEditando = _id;

        document.getElementById("idFavorito").value = f.idFavorito || "";
        document.getElementById("usuario").value = f.usuario || "";
        document.getElementById("mascota").value = f.mascota || "";

        if (f.fechaGuardado) {
            const fecha = f.fechaGuardado.substring
                ? f.fechaGuardado.substring(0, 10)
                : String(f.fechaGuardado);
            document.getElementById("fechaGuardado").value = fecha;
        } else {
            document.getElementById("fechaGuardado").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar favoritas";
        modal.show();

    } catch (err) {
        console.error("Error al obtener favorita por ID:", err);
        alert("No se pudo obtener la favorita. Revisa la consola / network.");
    }
}


// ===============================
// FUNCION: ELIMINAR
// ===============================
async function eliminarFavoritas(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar esta favorita?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL_FAVORITAS + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);
        cargarDatosFavoritas();
    } catch (err) {
        console.error("Error eliminando favorita:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}


cargarDatosFavoritas();
