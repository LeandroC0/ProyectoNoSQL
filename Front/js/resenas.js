const APIURL_RESENAS = "http://localhost:7000/api/resenas/";

let idEditando = null;
const modalElement = document.getElementById("modalResena");
const modal = new bootstrap.Modal(modalElement);


window.editarResena = editarResena;
window.eliminarResena = eliminarResena;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosResenas() {
    try {
        const res = await fetch(APIURL_RESENAS);
        if (!res.ok) throw new Error(`Error al cargar reseñas: ${res.status}`);

        const resenas = await res.json();
        const tbody = document.getElementById("tablaResenas");
        tbody.innerHTML = "";

        resenas.forEach(r => {
            
            const estrellas = '★'.repeat(r.calificacion) + '☆'.repeat(5 - r.calificacion);
            
            tbody.innerHTML += `
                <tr>
                    <td>${r.usuario || ""}</td>
                    <td>${r.mascota || ""}</td>
                    <td>${r.refugio || ""}</td>
                    <td>
                        <span class="text-warning">${estrellas}</span> (${r.calificacion}/5)
                    </td>
                    <td>${r.comentario || ""}</td>
                    <td>${r.fecha || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarResena('${r._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarResena('${r._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando reseñas.");
    }
}

// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("resenaFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        usuario: document.getElementById("usuarioResena").value,
        mascota: document.getElementById("mascotaResena").value,
        refugio: document.getElementById("refugioResena").value,
        calificacion: parseInt(document.getElementById("calificacionResena").value),
        comentario: document.getElementById("comentarioResena").value,
        fecha: document.getElementById("fechaResena").value
    };

    try {
        if (!idEditando) {
            // Crear nueva reseña
            const res = await fetch(APIURL_RESENAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear reseña");
        } else {
            // Actualizar reseña existente
            const res = await fetch(APIURL_RESENAS + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar reseña");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva Reseña";
        }

        e.target.reset();
        modal.hide();
        cargarDatosResenas();

    } catch (error) {
        console.error(error);
        alert("Error guardando reseña.");
    }
});

// ===============================
// EDITAR (VERSIÓN SEGURA)
// ===============================
async function editarResena(idResena) {
    console.log("ID recibido desde botón:", idResena);

    try {
        const res = await fetch(`${APIURL_RESENAS}${idResena}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const resena = await res.json();
        console.log("Reseña recibida:", resena);

        idEditando = idResena;


        document.getElementById("usuarioResena").value = resena.usuario || "";
        document.getElementById("mascotaResena").value = resena.mascota || "";
        document.getElementById("refugioResena").value = resena.refugio || "";
        document.getElementById("calificacionResena").value = resena.calificacion || "";
        document.getElementById("comentarioResena").value = resena.comentario || "";
        document.getElementById("fechaResena").value = resena.fecha || "";


        document.querySelector(".modal-title").textContent = "Editar Reseña";


        modal.show();

    } catch (err) {
        console.error("Error al obtener reseña por ID:", err);
        alert("No se pudo obtener la reseña. Revisa la consola / network.");
    }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarResena(id) {
    if (!confirm("¿Seguro que deseas eliminar esta reseña?")) return;

    try {
        const res = await fetch(APIURL_RESENAS + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosResenas();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar reseña.");
    }
}

cargarDatosResenas();