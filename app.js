let servicios = [
    {
        nombre: "Impresión 3D Personalizada",
        precio: 50000,
        imagen: "imagenes/impresion3d.jpg",
        descripción: "Transformamos tus ideas en objetos tangibles con nuestra impresión 3D personalizada. Desde piezas decorativas hasta herramientas mecánicas, damos vida a tus diseños con calidad y precisión."
    },
    {
        nombre: "Diseño Modelo 3D",
        precio: 30000,
        imagen: "imagenes/diseno3d.jpg",
        descripción: "Asesoría y creación de modelos digitales para impresión, con atención a cada detalle."
    },
    {
        nombre: "Grabado Láser (Próximamente)",
        precio: 25000,
        imagen: "imagenes/grabado.jpg",
        descripción: "Personalización de objetos con grabado láser, ideal para regalos y decoración."
    }
];

let contenedor = document.getElementById("contenedorServicios");

servicios.forEach(servicio => {
    contenedor.innerHTML += `<div class="card">
                                <img src="${servicio.imagen}">
                                <h3>${servicio.nombre}</h3>
                                <p>${servicio.descripción}</p>
                                <p>Precio: $${servicio.precio}</p>
                            </div>`;
});

let datosRegiones = null;

async function cargarDatos() {
    try {
        const respuesta = await fetch("regiones.json");
        datosRegiones = await respuesta.json();
        cargarRegiones();
    } catch (error) {
        console.error("Error cargando datos locales:", error);
        const regionSelect = document.getElementById("region");
        regionSelect.innerHTML = '<option value="">Error al cargar regiones</option>';
    }
}

function cargarRegiones() {
    const regionSelect = document.getElementById("region");
    const ciudadSelect = document.getElementById("ciudad");

    if (!datosRegiones) {
        regionSelect.innerHTML = '<option value="">Error: no hay datos</option>';
        return;
    }

    regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
    datosRegiones.regiones.forEach((region, index) => {
        regionSelect.innerHTML += `<option value="${index}">${region.nombre}</option>`;
    });

    ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    ciudadSelect.disabled = true;
}

function cargarCiudades(indiceRegion) {
    const ciudadSelect = document.getElementById("ciudad");

    if (!indiceRegion || indiceRegion === "") {
        ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
        ciudadSelect.disabled = true;
        return;
    }

    const regionSeleccionada = datosRegiones.regiones[indiceRegion];
    const comunas = regionSeleccionada.comunas;

    ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    comunas.forEach(comuna => {
        ciudadSelect.innerHTML += `<option value="${comuna.codigo}">${comuna.nombre}</option>`;
    });

    ciudadSelect.disabled = false;
}

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();

    document.getElementById("region").addEventListener("change", function() {
        cargarCiudades(this.value);
    });
});

emailjs.init("MhafuhrxDrlR1YELP");

document.getElementById("formulario").addEventListener("submit", function(e) {
    e.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let regionSelect = document.getElementById("region");
    let ciudadSelect = document.getElementById("ciudad");
    let region = regionSelect.options[regionSelect.selectedIndex].text;
    let ciudad = ciudadSelect.options[ciudadSelect.selectedIndex].text;
    let mensaje = document.getElementById("mensaje").value.trim();

    let error = document.getElementById("error");

    const templateParams = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        region: region,
        ciudad: ciudad,
        mensaje: mensaje
    };

    emailjs.send("service_1kjilmq","template_anrcvlp", templateParams)
        .then(function(response) {
            error.textContent = "¡Mensaje enviado correctamente!";
            error.style.color = "#0f0";
            console.log("Email enviado:", response);
            document.getElementById("formulario").reset();
        })
        .catch(function(error) {
            error.textContent = "Error al enviar el mensaje. Intenta de nuevo.";
            error.style.color = "#f00";
            console.error("Error:", error);
        });
});