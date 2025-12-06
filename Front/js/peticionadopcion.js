
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
        if (!res.ok) throw new Error(`Error al cargar peticiones adopcion: ${res.status} ${res.statusText}`);
        const peticionesadopcion = await res.json();

        const tbody = document.getElementById("tablaPeticionAdopcion");
        tbody.innerHTML = "";

        peticionesadopcion.forEach(f => {
        
            const fecha = f.fechaPeticion ? (f.fechaPeticion.substring ? f.fechaPeticion.substring(0,10) : String(f.fechaPeticion)) : "";
            const fechaR = f.fechaRespuesta ? (f.fechaRespuesta.substring ? f.fechaRespuesta.substring(0,10) : String(f.fechaRespuesta)) : "";

            tbody.innerHTML += `
                <tr>
                    <td>${f.idPeticion || ""}</td>
                    <td>${f.usuario || ""}</td>
                    <td>${f.mascota || ""}</td>
                    <td>${f.refugio || ""}</td>
                    <td>${f.estado || ""}</td>
                    <td>${fecha}</td>
                    <td>${fechaR}</td>
                    <td>${f.notasRefugio || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarPeticionAdopcion('${f.idPeticion}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPeticionAdopcion('${f.idPeticion}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        alert("Error cargando peticiones de adopcion. Revisa la consola para más detalles.");
    }
}


// ===============================
// GUARDAR O EDITAR USUARIO
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
        if (!idEditando) {
            const res = await fetch(APIURL_PETICIONADOPCION, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            const res = await fetch(APIURL_PETICIONADOPCION + idEditando, {
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
        cargarDatosPeticionAdopcion();
    } catch (err) {
        console.error("Error guardando/actualizando:", err);
        alert("Error al guardar/actualizar. Revisa la consola.");
    }
});


// ===============================
// FUNCION: EDITAR
// ===============================
async function editarPeticionAdopcion(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(APIURL_PETICIONADOPCION + _id);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const f = await res.json();

        idEditando = _id;

        document.getElementById("idPeticion").value = f.idPeticion || "";
        document.getElementById("usuario").value = f.usuario || "";
        document.getElementById("mascota").value = f.mascota || "";
        document.getElementById("refugio").value = f.refugio || "";
        document.getElementById("estado").value = f.estado || "";

        if (f.fechaPeticion) {
            const fecha = f.fechaPeticion.substring
                ? f.fechaPeticion.substring(0, 10)
                : String(f.fechaPeticion);
            document.getElementById("fechaPeticion").value = fecha;
        } else {
            document.getElementById("fechaPeticion").value = "";
        }

        if (f.fechaRespuesta) {
            const fechaR = f.fechaRespuesta.substring
                ? f.fechaRespuesta.substring(0, 10)
                : String(f.fechaRespuesta);
            document.getElementById("fechaRespuesta").value = fechaR;
        } else {
            document.getElementById("fechaRespuesta").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar peticiones de adopcion";
        modal.show();

    } catch (err) {
        console.error("Error al obtener peticiones de adopcion por ID:", err);
        alert("No se pudo obtener las peticiones de adopcion. Revisa la consola / network.");
    }
}


// ===============================
// FUNCION: ELIMINAR
// ===============================
async function eliminarPeticionAdopcion(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar esta peticion de adopcion?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL_PETICIONADOPCION + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);
        cargarDatosPeticionAdopcion();
    } catch (err) {
        console.error("Error eliminando peticion de adopcion:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}


cargarDatosPeticionAdopcion();
