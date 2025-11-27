
const APIURL_TIPO = "http://localhost:7000/api/tipomascota/";

let idEditando = null;
const modalElement = document.getElementById("modalTipoMascota");
const modal = new bootstrap.Modal(modalElement);

window.editarTipo = editarTipo;
window.eliminarTipo = eliminarTipo;


// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosTipo() {
    try {
        const res = await fetch(APIURL_TIPO);
        if (!res.ok) throw new Error(`Error al cargar tipos: ${res.status}`);

        const tipos = await res.json();
        const tbody = document.getElementById("tablaTipos");
        tbody.innerHTML = "";

        tipos.forEach(t => {
            tbody.innerHTML += `
                <tr>
                    <td>${t.tipoMascotaId || ""}</td>
                    <td>${t.nombre || ""}</td>
                    <td>${t.descripcion || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarTipo('${t._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarTipo('${t._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando tipos de mascota.");
    }
}


// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("tipoFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        tipoMascotaId: document.getElementById("tipoMascotaId").value,
        nombre: document.getElementById("nombreTipo").value,
        descripcion: document.getElementById("descripcionTipo").value
    };

    try {
        if (!idEditando) {
            // Crear nuevo tipo
            const res = await fetch(APIURL_TIPO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear tipo");
        } else {
            // Actualizar tipo existente
            const res = await fetch(APIURL_TIPO + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar tipo");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nuevo Tipo de Mascota";
        }

        e.target.reset();
        modal.hide();
        cargarDatosTipo();

    } catch (error) {
        console.error(error);
        alert("Error guardando tipo.");
    }
});


// ===============================
// EDITAR
// ===============================

async function editarTipo(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/tipomascota/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const t = await res.json();

        idEditando = _id; 

        
        document.getElementById("tipoMascotaId").value = t.tipoMascotaId || "";
        document.getElementById("nombreTipo").value = t.nombre || ""; 
        document.getElementById("descripcionTipo").value = t.descripcion || ""; 

       
        document.querySelector(".modal-title").textContent = "Editar Tipo de Mascota";

    
        modal.show();

    } catch (err) {
        console.error("Error al obtener tipo por ID:", err);
        alert("No se pudo obtener el tipo de mascota. Revisa la consola / network.");
    }
}


// ===============================
// ELIMINAR
// ===============================
async function eliminarTipo(id) {
    if (!confirm("¿Seguro que deseas eliminar este tipo de mascota?")) return;

    try {
        const res = await fetch(APIURL_TIPO + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosTipo();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar tipo.");
    }
}

cargarDatosTipo();
