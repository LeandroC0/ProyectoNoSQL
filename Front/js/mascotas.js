const APIURL_MASCOTAS = "http://localhost:7000/api/mascotas/";

let idEditando = null;
const modalElement = document.getElementById("modalMascota");
const modal = new bootstrap.Modal(modalElement);

// Permitir uso global de funciones
window.editarMascota = editarMascota;
window.eliminarMascota = eliminarMascota;

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosMascotas() {
    try {
        const res = await fetch(APIURL_MASCOTAS);
        if (!res.ok) throw new Error(`Error al cargar mascotas: ${res.status}`);

        const mascotas = await res.json();
        const tbody = document.getElementById("tablaMascotas");
        tbody.innerHTML = "";

        mascotas.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td>${m.nombre || ""}</td>
                    <td>${m.tipoMascotaId || ""}</td>
                    <td>${m.raza || ""}</td>
                    <td>${m.edad || ""}</td>
                    <td>${m.sexo || ""}</td>
                    <td>${m.vacunas ? m.vacunas.join(', ') : ""}</td>
                    <td>${m.estado || ""}</td>
                    <td>${m.refugio || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarMascota('${m._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarMascota('${m._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Error cargando mascotas.");
    }
}
// ===============================
// GUARDAR O EDITAR
// ===============================
document.getElementById("mascotaFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombreMascota").value,
        tipoMascotaId: document.getElementById("tipoMascotaId").value,
        raza: document.getElementById("razaMascota").value,
        edad: parseInt(document.getElementById("edadMascota").value),
        sexo: document.getElementById("sexoMascota").value,
        vacunas: document.getElementById("vacunasMascota").value.split(',').map(v => v.trim()),
        estado: document.getElementById("estadoMascota").value,
        refugio: document.getElementById("refugioMascota").value
    };

    try {
        if (!idEditando) {
            // Crear nueva mascota
            const res = await fetch(APIURL_MASCOTAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al crear mascota");
        } else {
            // Actualizar mascota existente
            const res = await fetch(APIURL_MASCOTAS + idEditando, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error("Error al actualizar mascota");

            idEditando = null;
            document.querySelector(".modal-title").textContent = "Nueva Mascota";
        }

        e.target.reset();
        modal.hide();
        cargarDatosMascotas();

    } catch (error) {
        console.error(error);
        alert("Error guardando mascota.");
    }
});

// ===============================
// EDITAR
// ===============================
async function editarMascota(_id) {
    console.log("ID recibido desde botón:", _id);

    try {
        const res = await fetch(`http://localhost:7000/api/mascotas/${_id}`);

        if (!res.ok) {
            throw new Error(`GET por ID falló: ${res.status} ${res.statusText}`);
        }

        const m = await res.json();

        idEditando = _id; 

      
        document.getElementById("nombreMascota").value = m.nombre || "";
        document.getElementById("tipoMascotaId").value = m.tipoMascotaId || "";
        document.getElementById("razaMascota").value = m.raza || "";
        document.getElementById("edadMascota").value = m.edad || "";
        document.getElementById("sexoMascota").value = m.sexo || "";
        document.getElementById("vacunasMascota").value = m.vacunas ? m.vacunas.join(', ') : "";
        document.getElementById("estadoMascota").value = m.estado || "";
        document.getElementById("refugioMascota").value = m.refugio || "";

        
        document.querySelector(".modal-title").textContent = "Editar Mascota";

        
        modal.show();

    } catch (err) {
        console.error("Error al obtener mascota por ID:", err);
        alert("No se pudo obtener la mascota. Revisa la consola / network.");
    }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarMascota(id) {
    if (!confirm("¿Seguro que deseas eliminar esta mascota?")) return;

    try {
        const res = await fetch(APIURL_MASCOTAS + id, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        cargarDatosMascotas();

    } catch (err) {
        console.error(err);
        alert("Error al eliminar mascota.");
    }
}

cargarDatosMascotas();