
const APIURL_FOTOSMASCOTA = "http://localhost:7000/api/fotosmascota/";


let idEditando = null;
const modalElement = document.getElementById("modalFotoMascota");
const modal = new bootstrap.Modal(modalElement);

window.editarFotosMascota = editarFotosMascota;
window.eliminarFotosMascota = eliminarFotosMascota;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosFotoMascota() {
    try {
        const res = await fetch(APIURL_FOTOSMASCOTA);
        if (!res.ok) throw new Error(`Error al cargar fotos de mascota: ${res.status} ${res.statusText}`);
        const fotosmascota = await res.json();

        const tbody = document.getElementById("tablaFotosMascota");
        tbody.innerHTML = "";

        fotosmascota.forEach(f => {
        
            const fecha = f.fechaSubida ? (f.fechaSubida.substring ? f.fechaSubida.substring(0,10) : String(f.fechaSubida)) : "";

            tbody.innerHTML += `
                <tr>
                    <td>${f.idFoto || ""}</td>
                    <td>${f.mascota || ""}</td>
                    <td>${f.url || ""}</td> 
                    <td>${f.descripcion || ""}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarFotosMascota('${f.idFoto}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarFotosMascota('${f.idFoto}')">Eliminar</button>
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
document.getElementById("fotosmascotaFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idFoto: document.getElementById("idFoto").value,
        mascota: document.getElementById("mascota").value,
        url: document.getElementById("url").value,
        descripcion: document.getElementById("descripcion").value,
        fechaSubida: document.getElementById("fechaSubida").value
    };

    try {
        if (!idEditando) {
            const res = await fetch(APIURL_FOTOSMASCOTA, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            const res = await fetch(APIURL_FOTOSMASCOTA + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`PUT falló: ${res.status}`);
            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva Foto de Mascota";
        }

        e.target.reset();
        modal.hide();
        cargarDatosFotoMascota();
    } catch (err) {
        console.error("Error guardando/actualizando:", err);
        alert("Error al guardar/actualizar. Revisa la consola.");
    }
});


// ===============================
// FUNCION: EDITAR
// ===============================
async function editarFotosMascota(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(APIURL_FOTOSMASCOTA + _id);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const f = await res.json();

        idEditando = _id;

        document.getElementById("idFoto").value = f.idFoto || "";
        document.getElementById("mascota").value = f.mascota || "";
        document.getElementById("url").value = f.url || "";
        document.getElementById("descripcion").value = f.descripcion || "";

        if (f.fechaSubida) {
            const fecha = f.fechaSubida.substring
                ? f.fechaSubida.substring(0, 10)
                : String(f.fechaSubida);
            document.getElementById("fechaSubida").value = fecha;
        } else {
            document.getElementById("fechaSubida").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar favoritas";
        modal.show();

    } catch (err) {
        console.error("Error al obtener foto de mascota por ID:", err);
        alert("No se pudo obtener la favorita. Revisa la consola / network.");
    }
}


// ===============================
// FUNCION: ELIMINAR
// ===============================
async function eliminarFotosMascota(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar esta foto de mascota?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL_FOTOSMASCOTA + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);
        cargarDatosFotoMascota();
    } catch (err) {
        console.error("Error eliminando foto de mascota:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}


cargarDatosFotoMascota();
