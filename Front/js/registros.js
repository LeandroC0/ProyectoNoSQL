const APIURL_REGISTROS = "http://localhost:7000/api/registros/";

let idEditando = null;
const modalElement = document.getElementById("modalRegistro");
const modal = new bootstrap.Modal(modalElement);

window.editarRegistro = editarRegistro;
window.eliminarRegistro = eliminarRegistro;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosRegistros() {
    try {
        const res = await fetch(APIURL_REGISTROS);
        if (!res.ok) throw new Error(`Error al cargar registros: ${res.status}`);

        const registros = await res.json();
        const tbody = document.getElementById("tablaRegistros");
        tbody.innerHTML = "";

        registros.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r.usuario || ""}</td>
                    <td>${r.accion || ""}</td>
                    <td>${r.mascota || ""}</td>
                    <td>${r.fecha || ""}</td>
                    <td>${r.descripcion || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarRegistro('${r._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${r._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando registros.");
    }
}

// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("registroFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        usuario: document.getElementById("usuarioRegistro").value,
        accion: document.getElementById("accionRegistro").value,
        mascota: document.getElementById("mascotaRegistro").value,
        fecha: document.getElementById("fechaRegistro").value,
        descripcion: document.getElementById("descripcionRegistro").value
    };

    try {
        if (!idEditando) {
            // Crear nuevo registro
            const res = await fetch(APIURL_REGISTROS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear registro");
        } else {
            // Actualizar registro existente
            const res = await fetch(APIURL_REGISTROS + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar registro");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo Registro";
        }

        e.target.reset();
        modal.hide();
        cargarDatosRegistros();

    } catch (error) {
        console.error(error);
        alert("Error guardando registro.");
    }
});

// ===============================
// EDITAR
// ===============================
async function editarRegistro(idRegistro) {
    console.log("ID recibido desde botón:", idRegistro);

    try {
        const res = await fetch(`${APIURL_REGISTROS}${idRegistro}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const registro = await res.json();
        console.log("Registro recibido:", registro);

        idEditando = idRegistro;

        
        document.getElementById("usuarioRegistro").value = registro.usuario || "";
        document.getElementById("accionRegistro").value = registro.accion || "";
        document.getElementById("mascotaRegistro").value = registro.mascota || "";
        document.getElementById("fechaRegistro").value = registro.fecha || "";
        document.getElementById("descripcionRegistro").value = registro.descripcion || "";

        document.querySelector(".modal-title").textContent = "Editar Registro";

      
        modal.show();

    } catch (err) {
        console.error("Error al obtener registro por ID:", err);
        alert("No se pudo obtener el registro. Revisa la consola / network.");
    }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarRegistro(id) {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    try {
        const res = await fetch(APIURL_REGISTROS + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosRegistros();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar registro.");
    }
}

cargarDatosRegistros();