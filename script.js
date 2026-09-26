/* =====================================================
   MENÚ PARA CELULAR
===================================================== */

const menuBtn = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("active");

});


/* Cerrar menú al seleccionar una opción */

const enlacesMenu = document.querySelectorAll(".navbar a");

enlacesMenu.forEach(enlace => {

    enlace.addEventListener("click", () => {

        navbar.classList.remove("active");

    });

});


/* =====================================================
   WHATSAPP
===================================================== */

/*
   AQUÍ MÁS ADELANTE PONDREMOS EL NÚMERO REAL
   DE TU NOVIA.

   Por ahora NO lo cambies.
*/

const numeroWhatsApp = "573117944158";


function abrirWhatsApp(mensaje) {

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");

}


/* Botón principal de WhatsApp */

const whatsappBtn = document.getElementById("whatsappBtn");

if (whatsappBtn) {

    whatsappBtn.addEventListener("click", (evento) => {

        evento.preventDefault();

        const mensaje =
            "Hola , quiero obtener información sobre los servicios de uñas.";

        abrirWhatsApp(mensaje);

    });

}


/* Botón de WhatsApp del footer */

const whatsappFooter = document.getElementById("whatsappFooter");

if (whatsappFooter) {

    whatsappFooter.addEventListener("click", (evento) => {

        evento.preventDefault();

        const mensaje =
            "Hola , quiero información sobre tus servicios.";

        abrirWhatsApp(mensaje);

    });

}


/* =====================================================
   FORMULARIO DE CITAS
===================================================== */

const formulario = document.getElementById("formularioCita");

if (formulario) {

    formulario.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        /* Obtener información */

        const nombre =
            document.getElementById("nombre").value.trim();

        const telefono =
            document.getElementById("telefono").value.trim();

        const servicio =
            document.getElementById("servicio").value;

        const fecha =
            document.getElementById("fecha").value;

        const hora =
            document.getElementById("hora").value;


        /* Comprobar información */

        if (
            !nombre ||
            !telefono ||
            !servicio ||
            !fecha ||
            !hora
        ) {

            alert("Por favor completa todos los campos 💅🏻");

            return;

        }


        /* Guardar cita en MySQL */

        try {

            const respuesta = await fetch("/api/citas", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nombre,
                    telefono,
                    servicio,
                    fecha,
                    hora
                })

            });


            const resultado = await respuesta.json();


            if (!respuesta.ok) {

                alert("No se pudo guardar la cita ❌");

                console.log(resultado);

                return;

            }


            /* Convertir fecha */

            const fechaSeleccionada =
                new Date(fecha + "T00:00:00");


            const fechaFormateada =
                fechaSeleccionada.toLocaleDateString(
                    "es-CO",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );


            /* Crear mensaje de WhatsApp */

            const mensaje =
`Hola 💅🏻, quiero solicitar una cita.

👤 Nombre: ${nombre}

📱 WhatsApp: ${telefono}

💅🏻 Servicio: ${servicio}

📅 Fecha: ${fechaFormateada}

⏰ Hora: ${hora}

Quedo pendiente de la confirmación. ❤️`;


            /* Abrir WhatsApp */

            abrirWhatsApp(mensaje);


            /* Limpiar formulario */

            formulario.reset();


            alert("¡Cita registrada correctamente! 💅🏻❤️");


        } catch (error) {

            console.error("Error:", error);

            alert("No se pudo conectar con el servidor ❌");

        }

    });

}

/* =====================================================
   EVITAR FECHAS ANTERIORES
===================================================== */

const campoFecha = document.getElementById("fecha");

if (campoFecha) {

    const hoy = new Date();

    const año = hoy.getFullYear();

    const mes = String(
        hoy.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoy.getDate()
    ).padStart(2, "0");


    const fechaMinima =
        `${año}-${mes}-${dia}`;


    campoFecha.min = fechaMinima;

}


/* =====================================================
   ANIMACIÓN AL HACER SCROLL
===================================================== */

const elementosAnimados =
    document.querySelectorAll(
        ".servicio, .foto, .nosotros-contenido, .nosotros-imagen, .formulario-contenedor"
    );


const observador =
    new IntersectionObserver(
        (elementos) => {

            elementos.forEach(elemento => {

                if (elemento.isIntersecting) {

                    elemento.target.style.opacity = "1";

                    elemento.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.15
        }
    );


elementosAnimados.forEach(elemento => {

    elemento.style.opacity = "0";

    elemento.style.transform =
        "translateY(30px)";

    elemento.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    observador.observe(elemento);

});

function abrirFoto(imagen) {

    const visor = document.getElementById("visorFoto");
    const fotoGrande = document.getElementById("fotoGrande");

    fotoGrande.src = imagen.src;

    visor.classList.add("activo");
}


function cerrarFoto() {

    const visor = document.getElementById("visorFoto");

    visor.classList.remove("activo");
}