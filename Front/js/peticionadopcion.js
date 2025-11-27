// peticionadopcion.js
const APIURL_PETICION = "http://localhost:7000/api/peticionadopcion/";

let idEditando = null;
const modalElement = document.getElementById("modalPeticionAdopcion");
const modal = new bootstrap.Modal(modalElement);

// Permitir uso global de funciones
window.editarPeticionAdopcion = editarPeticionAdopcion;
window.eliminarPeticionAdopcion = eliminarPeticionAdopcion;


// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosPeticionAdopcion() {
    try {
        const res = await fetch(APIURL_PETICION);
        if (!res.ok) throw new Error(`Error al cargar peticion de adopcion: ${res.status}`);

        const peticion = await res.json();
        const tbody = document.getElementById("tablaPeticionAdopcion");
        tbody.innerHTML = "";

        peticion.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td>${p.idPeticion || ""}</td>
                    <td>${p.usuario || ""}</td>
                    <td>${p.refugio || ""}</td>
                    <td>${p.estado || ""}</td>
                    <td>${p.fechaPeticion || ""}</td>
                    <td>${p.fechaRespuesta || ""}</td>
                    <td>${p.notasRefugio || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarPeticionAdopcion('${p._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPeticionAdopcion('${p._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando peticion de adopcion.");
    }
}


// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("tipoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idPeticion: document.getElementById("idPeticion").value,
        usuario: document.getElementById("usuario").value,
        mascota: document.getElementById("mascota").value,
        refugio: document.getElementById("refugio").value,
        estado: document.getElementById("estado").value,
        fechaPeticion: document.getElementById("fechaPeticion").value,
        fechaRespuesta: document.getElementById("fechaRespuesta").value,
        notasRefugio: document.getElementById("notasRefugio").value

    };

    try {
        if (!idEditando) {
            // Crear nueva peticion
            const res = await fetch(APIURL_PETICION, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear peticion de adopcion");
        } else {
            // Actualizar peticiones de adopcion
            const res = await fetch(APIURL_PETICION + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar peticion de adopcion");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva peticion de adopcion";
        }

        e.target.reset();
        modal.hide();
        cargarDatosPeticionAdopcion();

    } catch (error) {
        console.error(error);
        alert("Error guardando peticion de adopcion.");
    }
});


// ===============================
// EDITAR
// ===============================
// ===============================
// EDITAR
// ===============================
async function editarPeticionAdopcion(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/peticionadopcion/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const p = await res.json();

        idEditando = _id; // Guarda el ID para usarlo luego en actualizar

        // CORREGIR: Usar los mismos IDs que están en el HTML
        document.getElementById("idPeticion").value = p.idPeticion || "";
        document.getElementById("usuario").value = p.usuario || ""; 
        document.getElementById("mascota").value = p.mascota || ""; 
        document.getElementById("refugio").value = p.refugio || "";
        document.getElementById("estado").value = p.estado || "";
        document.getElementById("fechaPeticion").value = p.fechaPeticion || "";
        document.getElementById("fechaRespuesta").value = p.fechaRespuesta || "";
        document.getElementById("notasRefugio").value = p.notasRefugio || "";

        // Cambiar título del modal
        document.querySelector(".modal-title").textContent = "Editar peticion de adopcion";

        // Abrir modal
        modal.show();

    } catch (err) {
        console.error("Error al obtener tipo por ID:", err);
        alert("No se pudo obtener la peticion de adopcion. Revisa la consola / network.");
    }
}


// ===============================
// ELIMINAR
// ===============================
async function eliminarPeticionAdopcion(id) {
    if (!confirm("¿Seguro que deseas eliminar esta peticion de adopcion?")) return;

    try {
        const res = await fetch(APIURL_PETICION + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosPeticionAdopcion();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar peticion de adopcion.");
    }
}

cargarDatosPeticionAdopcion();
