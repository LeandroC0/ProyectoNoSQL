const APIURL_PETICIONADOPCION = "http://localhost:7000/api/peticionadopcion/";

let idEditando = null;
const modalElement = document.getElementById("modalPeticionAdopcion");
const modal = new bootstrap.Modal(modalElement);

window.editarPeticionAdopcion = editarPeticionAdopcion;
window.eliminarPeticionAdopcion = eliminarPeticionAdopcion;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosPeticionAdopcion() {
    try {
        const res = await fetch(APIURL_PETICIONADOPCION);
        if (!res.ok) throw new Error(`Error al cargar: ${res.status}`);

        const peticionesadopcion = await res.json();
        const tbody = document.getElementById("tablaPeticionAdopcion");
        tbody.innerHTML = "";

        peticionesadopcion.forEach(p => {
            const fecha = p.fechaPeticion?.substring(0, 10) || "";
            const fechaR = p.fechaRespuesta?.substring(0, 10) || "";

            tbody.innerHTML += `
                <tr>
                    <td>${p.idPeticion || ""}</td>
                    <td>${p.usuario || ""}</td>
                    <td>${p.mascota || ""}</td>
                    <td>${p.refugio || ""}</td>
                    <td>${p.estado || ""}</td>
                    <td>${fecha}</td>
                    <td>${fechaR}</td>
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
        alert("Error cargando peticiones.");
    }
}

// ===============================
// LIMPIAR FORMULARIO AL ABRIR MODAL PARA CREAR
// ===============================
modalElement.addEventListener("show.bs.modal", () => {
    if (!idEditando) {
        document.getElementById("peticionesadopcionFormulario").reset();
        document.querySelector(".modal-title").textContent = "Nueva Petición de Adopción";
    }
});

// ===============================
// SUBMIT (CREAR / EDITAR)
// ===============================
document.getElementById("peticionesadopcionFormulario").addEventListener("submit", async e => {
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
        let res;

        if (!idEditando) {
            // Crear
            res = await fetch(APIURL_PETICIONADOPCION, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        } else {
            // Editar
            res = await fetch(APIURL_PETICIONADOPCION + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        }

        if (!res.ok) throw new Error("Error en POST/PUT");

        idEditando = null;
        e.target.reset();
        modal.hide();
        cargarDatosPeticionAdopcion();

    } catch (err) {
        console.error("Error guardando:", err);
        alert("Error al guardar.");
    }
});

// ===============================
// EDITAR
// ===============================
async function editarPeticionAdopcion(_id) {
    try {
        const res = await fetch(APIURL_PETICIONADOPCION + _id);
        if (!res.ok) throw new Error("GET por ID falló");

        const p = await res.json();

        idEditando = _id;

        document.getElementById("idPeticion").value = p.idPeticion || "";
        document.getElementById("usuario").value = p.usuario || "";
        document.getElementById("mascota").value = p.mascota || "";
        document.getElementById("refugio").value = p.refugio || "";
        document.getElementById("estado").value = p.estado || "";
        document.getElementById("fechaPeticion").value = p.fechaPeticion?.substring(0, 10) || "";
        document.getElementById("fechaRespuesta").value = p.fechaRespuesta?.substring(0, 10) || "";
        document.getElementById("notasRefugio").value = p.notasRefugio || "";

        document.querySelector(".modal-title").textContent = "Editar Petición de Adopción";
        modal.show();

    } catch (err) {
        console.error(err);
        alert("No se pudo cargar la petición.");
    }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarPeticionAdopcion(id) {
    if (!confirm("¿Seguro que deseas eliminar esta petición?")) return;

    try {
        const res = await fetch(APIURL_PETICIONADOPCION + id, { method: "DELETE" });
        if (!res.ok) throw new Error("DELETE falló");

        cargarDatosPeticionAdopcion();

    } catch (err) {
        console.error(err);
        alert("Error eliminando.");
    }
}

cargarDatosPeticionAdopcion();
