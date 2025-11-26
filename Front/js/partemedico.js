// partemedico.js
const APIURL_PARTE = "http://localhost:7000/api/partemedico/";

let idEditando = null;
const modalElement = document.getElementById("modalParteMedico");
const modal = new bootstrap.Modal(modalElement);

// Permitir uso global de funciones
window.editarParteMedico = editarParteMedico;
window.eliminarParteMedico = eliminarParteMedico;


// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosParteMedico() {
    try {
        const res = await fetch(APIURL_PARTE);
        if (!res.ok) throw new Error(`Error al cargar parte medico: ${res.status}`);

        const parte = await res.json();
        const tbody = document.getElementById("tablaParteMedico");
        tbody.innerHTML = "";

        parte.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td>${p.idHistorial || ""}</td>
                    <td>${p.mascota || ""}</td>
                    <td>${p.fecha || ""}</td>
                    <td>${p.veterinario || ""}</td>
                    <td>${p.diagnostico || ""}</td>
                    <td>${p.tratamiento || ""}</td>
                    <td>${p.proximaCita || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarParteMedico('${f._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarParteMedico('${f._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando parte medico.");
    }
}


// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("tipoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idHistorial: document.getElementById("idHistorial").value,
        mascota: document.getElementById("mascota").value,
        fecha: document.getElementById("fecha").value,
        veterinario: document.getElementById("veterinario").value,
        tratamiento: document.getElementById("tratamiento").value,
        proximaCita: document.getElementById("proximaCita").value
    };

    try {
        if (!idEditando) {
            // Crear nuevo parte
            const res = await fetch(APIURL_PARTE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear parte medico");
        } else {
            // Actualizar partes medicos existentes
            const res = await fetch(APIURL_PARTE + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar parte medico");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo parte medico";
        }

        e.target.reset();
        modal.hide();
        cargarDatosParteMedico();

    } catch (error) {
        console.error(error);
        alert("Error guardando parte medico.");
    }
});


// ===============================
// EDITAR
// ===============================
// ===============================
// EDITAR
// ===============================
async function editarParteMedico(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/partemedico/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const p = await res.json();

        idEditando = _id; // Guarda el ID para usarlo luego en actualizar

        // CORREGIR: Usar los mismos IDs que están en el HTML
        document.getElementById("idHistorial").value = p.idHistorial || "";
        document.getElementById("mascota").value = p.mascota || ""; 
        document.getElementById("fecha").value = p.fecha || ""; 
        document.getElementById("veterinario").value = p.veterinario || "";
        document.getElementById("diagnostico").value = p.diagnostico || "";
        document.getElementById("tratamiento").value = p.tratamiento || "";
        document.getElementById("proximaCita").value = p.proximaCita || "";

        // Cambiar título del modal
        document.querySelector(".modal-title").textContent = "Editar parte medico";

        // Abrir modal
        modal.show();

    } catch (err) {
        console.error("Error al obtener tipo por ID:", err);
        alert("No se pudo obtener el parte medico. Revisa la consola / network.");
    }
}


// ===============================
// ELIMINAR
// ===============================
async function eliminarParteMedico(id) {
    if (!confirm("¿Seguro que deseas eliminar este parte medico?")) return;

    try {
        const res = await fetch(APIURL_PARTE + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosParteMedico();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar parte medico.");
    }
}

cargarDatosParteMedico();
