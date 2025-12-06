
const APIURL_PARTEMEDICO = "http://localhost:7000/api/partemedico/";


let idEditando = null;
const modalElement = document.getElementById("modalParteMedico");
const modal = new bootstrap.Modal(modalElement);

window.editarParteMedico = editarParteMedico;
window.eliminarParteMedico = eliminarParteMedico;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosParteMedico() {
    try {
        const res = await fetch(APIURL_PARTEMEDICO);
        if (!res.ok) throw new Error(`Error al cargar Parte Medico: ${res.status} ${res.statusText}`);
        const ParteMedico = await res.json();

        const tbody = document.getElementById("tablaParteMedico");
        tbody.innerHTML = "";

        ParteMedico.forEach(p => {
        
            const fecha = p.fecha ? (p.fecha.substring ? p.fecha.substring(0,10) : String(p.fecha)) : "";
            const fechapc = p.proximaCita ? (p.proximaCita.substring ? p.proximaCita.substring(0,10) : String(p.proximaCita)) : "";

            tbody.innerHTML += `
                <tr>
                    <td>${p.idHistorial || ""}</td>
                    <td>${p.mascota || ""}</td>
                    <td>${fecha}</td>
                    <td>${p.veterinario || ""}</td>
                    <td>${p.diagnostico || ""}</td>
                    <td>${p.tratamiento || ""}</td>
                    <td>${fechapc}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarParteMedico('${p._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarParteMedico('${p._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        alert("Error cargando Parte Medico. Revisa la consola para más detalles.");
    }
}


// ===============================
// GUARDAR O EDITAR USUARIO
// ===============================
document.getElementById("ParteMedicoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        idHistorial: document.getElementById("idHistorial").value,
        mascota: document.getElementById("mascota").value,
        fecha: document.getElementById("fecha").value,
        veterinario: document.getElementById("veterinario").value,
        diagnostico: document.getElementById("diagnostico").value,
        tratamiento: document.getElementById("tratamiento").value,
        proximaCita: document.getElementById("proximaCita").value
    };

    try {
        if (!idEditando) {
            const res = await fetch(APIURL_PARTEMEDICO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`POST falló: ${res.status}`);
        } else {
            const res = await fetch(APIURL_PARTEMEDICO + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error(`PUT falló: ${res.status}`);
            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo Parte Medico";
        }

        e.target.reset();
        modal.hide();
        cargarDatosParteMedico();
    } catch (err) {
        console.error("Error guardando/actualizando:", err);
        alert("Error al guardar/actualizar. Revisa la consola.");
    }
});


// ===============================
// FUNCION: EDITAR
// ===============================
async function editarParteMedico(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(APIURL_PARTEMEDICO + _id);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const p = await res.json();

        idEditando = _id;

        document.getElementById("idHistorial").value = p.idHistorial || "";
        document.getElementById("mascota").value = p.mascota || "";
        document.getElementById("veterinario").value = p.veterinario || "";
        document.getElementById("diagnostico").value = p.diagnostico || "";
        document.getElementById("tratamiento").value = p.tratamiento || "";
        if (p.fecha) {
            const fecha = p.fecha.substring
                ? p.fecha.substring(0, 10)
                : String(p.fecha);
            document.getElementById("fecha").value = fecha;
        } else {
            document.getElementById("fecha").value = "";
        }
        // document.getElementById("veterinario").value = p.veterinario || "";
        // document.getElementById("diagnostico").value = p.diagnostico || "";
        // document.getElementById("tratamiento").value = p.tratamiento || "";
        if (p.proximaCita) {
            const fechapc = p.proximaCita.substring
                ? p.proximaCita.substring(0, 10)
                : String(p.proximaCita);
            document.getElementById("proximaCita").value = fechapc;
        } else {
            document.getElementById("proximaCita").value = "";
        }

        document.querySelector(".modal-title").textContent = "Editar Parte Medico";
        modal.show();

    } catch (err) {
        console.error("Error al obtener Parte Medico por ID:", err);
        alert("No se pudo obtener el Parte Medico. Revisa la consola / network.");
    }
}


// ===============================
// FUNCION: ELIMINAR
// ===============================
async function eliminarParteMedico(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este Parte Medico?");
    if (!confirmar) return;

    try {
        const res = await fetch(APIURL_PARTEMEDICO + id, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló: ${res.status}`);
        cargarDatosParteMedico();
    } catch (err) {
        console.error("Error eliminando Parte Medico:", err);
        alert("Error al eliminar. Revisa la consola.");
    }
}


cargarDatosParteMedico();
